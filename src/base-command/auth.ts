import {Interfaces, ux} from '@oclif/core';
import chalk from 'chalk';
import {debug} from 'debug';
import * as fse from 'fs-extra';
import {HTTP, HTTPError} from 'http-call';
import * as fs from 'node:fs';
import * as path from 'node:path';

import {T} from '.';

interface DeviceCodeRes {
  device_code: string;
  expires_in: number;
  interval: number;
  user_code: string;
  verification_uri: string;
  verification_uri_complete: string;
}

interface TokenRes {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Auth {
  /** Is the user considered to be logged in? */
  public loggedIn = false;

  private readonly defaultAuthServer = 'https://auth.apimetrics.io';
  // eslint-disable-next-line perfectionist/sort-classes
  private authServer = process.env.APIMETRICS_AUTH_SERVER || this.defaultAuthServer;
  private clientId = process.env.APIMETRICS_CLIENT_ID || 'dPbV4VPvioF4nZ3oGQMn7n1vE2pFNAAI';
  private codeUrl = 'https://auth.apimetrics.io/oauth/device/code';
  private configDir: string;
  private debug = debug('api');
  private revokeUrl = 'https://auth.apimetrics.io/oauth/revoke';
  // Flag to avoid excess API calls.
  private setAuthURLs = false;
  private token: Auth.ConfigFile = {
    expires: undefined,
    mode: undefined,
    refresh: '',
    token: '',
  };

  private tokenUrl = 'https://auth.apimetrics.io/oauth/token';
  private userInfoUrl = 'https://auth.apimetrics.io/userinfo';

  /**
   * @param config User config file
   * @param jsonMode Is the CLI operating in --json mode?
   */
  constructor(private readonly config: Interfaces.Config, private jsonMode: boolean) {
    this.configDir = process.env.APIMETRICS_CONFIG_DIR || this.config.configDir;
    HTTP.defaults.headers = {'user-agent': config.userAgent};
    this.loadAuth();
  }

  /**
   * Is the user restricted to only project actions
   * Normally only restricted when user is using API key authentication
   */
  public get projectOnly(): boolean {
    return this.token.mode === Auth.AuthType.Key;
  }

  /**
   * Formatted authorization header including credentials
   */
  public async headers(): Promise<{Authorization: string}> {
    const tenMinutes = 1000 * 60 * 10;
    if (
      this.token.expires !== undefined &&
      new Date(this.token.expires).getTime() - Date.now() < tenMinutes
    ) {
      await this.refreshToken();
    }

    return {Authorization: `Bearer ${this.token.token}`};
  }

  /**
   * Attempt to login the user
   * @param options Login options passed by user
   */
  public async login(options: Auth.Options): Promise<void> {
    if (!options.type) {
      // Default to OAuth Device Flow
      options.type = options.key ? Auth.AuthType.Key : Auth.AuthType.Device;
    }

    switch (options.type) {
      case Auth.AuthType.Key: {
        await this.key(options.key);
        break;
      }

      case Auth.AuthType.Device: {
        await this.deviceFlow();
      }
    }
  }

  /**
   * Log out of application
   * If using OAuth, revoke the refresh token
   */
  public async logout(): Promise<void> {
    if (this.token.mode === Auth.AuthType.Device) {
      if (this.token.refresh) {
        try {
          await HTTP.post(this.revokeUrl, {
            // eslint-disable-next-line camelcase
            body: {client_id: this.clientId, token: this.token.refresh},
          });
        } catch (error) {
          ux.warn(`Failed to revoke refresh token. ${error}`);
        }
      } else {
        ux.warn('Did not attempt to revoke refresh token as token was undefined.');
      }
    }

    this.token.token = '';
    this.token.refresh = '';
    this.token.expires = undefined;
    this.token.mode = undefined;
    this.loggedIn = false;
    this.saveToken();
  }

  /**
   * Make call to OIDC userinfo endpoint
   * @returns User information
   */
  public async userinfo(): Promise<T.UserInfo> {
    if (!this.loggedIn) {
      throw new Error('Not logged in. Run apimetrics login first.');
    }

    await this.getEndpoints();

    if (this.token.mode === Auth.AuthType.Key) {
      throw new Error('Cannot use API key to access user info.');
    }

    // Normalise URL first
    const url = new URL(this.userInfoUrl);
    const {body} = await HTTP.get<T.UserInfo>(url.toString(), {headers: await this.headers()});
    return body;
  }

  /**
   * Authenticate the user using the Device Flow
   */
  private async deviceFlow(): Promise<void> {
    if (this.loggedIn) {
      throw new Error('User already logged in. Run apimetrics auth logout first');
    }

    await this.getEndpoints();

    const url = new URL(this.codeUrl);
    const {body: code} = await HTTP.post<DeviceCodeRes>(url.toString(), {
      body: `client_id=${this.clientId}&scope=openid%20profile%20email%20offline_access&audience=https%3A%2F%2Fclient.apimetrics.io`,
      headers: {'content-type': 'application/x-www-form-urlencoded'},
    });

    ux.info(`Opening browser to ${code.verification_uri_complete}`);
    // ESM doesn't want to work with mocha so we have this instead
    const {default: open} = await import('open');
    const browser = await open(code.verification_uri_complete);

    browser.on('error', (err) => {
      ux.warn(err);
      ux.warn('If browser does not open, visit');
      ux.url(code.verification_uri_complete, code.verification_uri_complete);
    });
    ux.info(`Verification Code: ${chalk.bold(code.user_code)}`);

    ux.action.start('Waiting for login');
    let token: TokenRes;
    try {
      token = await this.pollToken(code);
    } catch (error) {
      if (error instanceof Error) {
        ux.action.stop(chalk.yellow(error.message));
        return;
      }

      // Something must have thrown something random
      ux.action.stop('');
      throw error;
    }

    this.token.token = token.access_token;
    this.token.refresh = token.refresh_token;
    const now = new Date();
    now.setTime(now.getTime() + token.expires_in * 1000);
    this.token.expires = now;
    this.token.mode = Auth.AuthType.Device;
    await this.saveToken();
    this.loggedIn = true;
    ux.action.stop(chalk.green('Logged in'));
  }

  /**
   * Get the auth endpoints from the .well-known endpoint
   *
   * This should only ever run once as once it has set the endpoints, it
   * won't make another API call again so it is fine to call this
   * multiple times.
   */
  private async getEndpoints(): Promise<void> {
    if (this.authServer === this.defaultAuthServer || this.setAuthURLs) {
      // Don't bother with excess API calls, we already have the info
      return;
    }

    const wellKnownEndpoint = new URL('.well-known/openid-configuration', this.authServer);
    const {body: config} = await HTTP.get<T.OIDCWellKnown>(wellKnownEndpoint.toString());

    this.tokenUrl = config.token_endpoint;
    this.codeUrl = config.device_authorization_endpoint;
    this.revokeUrl = config.revocation_endpoint;
    this.userInfoUrl = config.userinfo_endpoint;
    this.setAuthURLs = true;
  }

  /**
   * Perform basic validation of user API key
   * Checks that the key is present and is of the correct length, but
   * does not check that it actually works.
   *
   * @param key API key passed by user
   */
  private async key(key?: string): Promise<void> {
    if (key) {
      if (key.length === 32) {
        this.token.token = key;
        this.token.mode = Auth.AuthType.Key;
        await this.saveToken();
        this.loggedIn = true;
      } else {
        throw new Error(`API key is malformed. Expected 32 characters, got ${key.length}`);
      }
    } else {
      throw new Error('No API key defined for API authentication method');
    }
  }

  /**
   * Load the authentication settings from disk
   */
  private loadAuth(): void {
    const filePath = path.join(this.configDir, 'auth.json');
    if (fs.existsSync(filePath)) {
      // Handling for malformed contents?
      this.token = fse.readJsonSync(filePath);
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
      return;
    }

    // If one or both are blank, we don't have valid details
    this.loggedIn = Boolean(this.token.token && this.token.mode);
  }

  /**
   * Poll the authorization server for an access code, backing off as necessary
   * @param code Code object retrieved from auth server previously
   * @param retry Retry interval in ms
   * @returns Requested token object
   */
  private async pollToken(code: DeviceCodeRes, retry?: number): Promise<TokenRes> {
    const retryms = retry || code.interval * 1000;
    await sleep(retryms);

    const url = new URL(this.tokenUrl);
    let token: TokenRes;
    try {
      const response = await HTTP.post<TokenRes>(url.toString(), {
        body: `grant_type=urn:ietf:params:oauth:grant-type:device_code&device_code=${encodeURIComponent(
          code.device_code
        )}&client_id=${this.clientId}`,
        headers: {'content-type': 'application/x-www-form-urlencoded'},
      });
      token = response.body;
    } catch (error) {
      if (error instanceof HTTPError) {
        switch (error.body.error) {
          case 'authorization_pending': {
            return this.pollToken(code, retryms);
          }

          case 'slow_down': {
            return this.pollToken(code, retryms * 2);
          }

          case 'expired_token':
          case 'invalid_grant': {
            throw new Error('Login timed out');
          }

          default: {
            throw new Error('Failed to login');
          }
        }
      }

      throw error;
    }

    return token;
  }

  /**
   * Attempt to refresh the access token
   */
  private async refreshToken(): Promise<void> {
    await this.getEndpoints();

    const url = new URL(this.tokenUrl);
    let token: TokenRes;
    try {
      const response = await HTTP.post<TokenRes>(url.toString(), {
        body: `grant_type=refresh_token&client_id=${
          this.clientId
        }&refresh_token=${encodeURIComponent(this.token.refresh)}`,
        headers: {'content-type': 'application/x-www-form-urlencoded'},
      });
      token = response.body;
    } catch (error) {
      this.debug('%O', error);

      // Invalidate stored authentication details so user can run login
      // straight away.
      this.token.token = '';
      this.token.refresh = '';
      this.loggedIn = false;
      await this.saveToken();
      throw new Error(`Failed to refresh access token. Please login again. ${error}`);
    }

    this.token.token = token.access_token;
    this.token.refresh = token.refresh_token;
    const now = new Date();
    now.setTime(now.getTime() + token.expires_in * 1000);
    this.token.expires = now;
    this.token.mode = Auth.AuthType.Device;
    await this.saveToken();
  }

  /**
   * Save the token to permanent storage
   */
  private async saveToken(): Promise<void> {
    const filePath = path.join(this.configDir, 'auth.json');
    await fse.writeJson(filePath, this.token);
  }
}

export namespace Auth {
  export enum AuthType {
    Device = 'device',
    Key = 'key',
  }
  export interface Options {
    key?: string;
    type?: AuthType;
  }

  export interface ConfigFile {
    expires: Date | undefined;
    mode: AuthType | undefined;
    refresh: string;
    token: string;
  }
}
