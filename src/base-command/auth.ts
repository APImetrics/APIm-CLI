import {Interfaces, ux} from '@oclif/core';
import * as path from 'node:path';
import * as fs from 'fs-extra';
import fetch from 'node-fetch';
import chalk from 'chalk';

interface DeviceCodeRes {
  // eslint-disable-next-line camelcase
  device_code: string;
  // eslint-disable-next-line camelcase
  user_code: string;
  // eslint-disable-next-line camelcase
  verification_uri: string;
  // eslint-disable-next-line camelcase
  expires_in: number;
  interval: number;
  // eslint-disable-next-line camelcase
  verification_uri_complete: string;
}

interface TokenRes {
  // eslint-disable-next-line camelcase
  access_token: string;
  // eslint-disable-next-line camelcase
  refresh_token: string;
  // eslint-disable-next-line camelcase
  token_type: string;
  // eslint-disable-next-line camelcase
  expires_in: number;
}

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Auth {
  /** Is the user considered to be logged in? */
  public loggedIn = false;

  private token: Auth.ConfigFile = {
    mode: undefined,
    token: '',
    refresh: '',
    expires: undefined,
  };

  private tokenUrl =
    process.env.APIMETRICS_TOKEN_URL || 'https://qc-auth.apimetrics.io/oauth/token';

  private codeUrl =
    process.env.APIMETRICS_CODE_URL || 'https://qc-auth.apimetrics.io/oauth/device/code';

  private revokeUrl =
    process.env.APIMETRICS_REVOKE_URL || 'https://qc-auth.apimetrics.io/oauth/revoke';

  private clientId = process.env.APIMETRICS_CLIENT_ID || '4fhqu4lEH5ExaRh00X1B9WJSkjTnUmuK';

  constructor(private readonly config: Interfaces.Config) {
    this.loadAuth();
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
      case Auth.AuthType.Key:
        await this.key(options.key);
        break;
      case Auth.AuthType.Device:
        await this.deviceFlow();
    }

    await this.saveToken();
    this.loggedIn = true;
  }

  /**
   * Log out of application
   * If using OAuth, revoke the refresh token
   */
  public async logout(): Promise<void> {
    if (this.token.mode === Auth.AuthType.Device) {
      const options = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: `{"client_id": "${this.clientId}", "token": "${this.token.refresh}"}`,
      };
      const response = await fetch(this.revokeUrl, options);
      if (!response.ok) {
        ux.warn(
          `Failed to revoke refresh token. Got HTTP ${response.status} ${response.statusText}`
        );
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
   * Is the user restricted to only project actions
   * Normally only restricted when user is using API key authentication
   */
  public get projectOnly(): boolean {
    return this.token.mode === Auth.AuthType.Key;
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
      } else {
        throw new Error(`API key is malformed. Expected 32 characters, got ${key.length}`);
      }
    } else {
      throw new Error('No API key defined for API authentication method');
    }
  }

  /**
   * Authenticate the user using the Device Flow
   */
  private async deviceFlow(): Promise<void> {
    if (this.loggedIn) {
      throw new Error('User already logged in. Run apimetrics auth logout first');
    }

    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `client_id=${this.clientId}&scope=openid%20profile%20email%20offline_access&audience=https%3A%2F%2Fclient.apimetrics.io`,
    };
    const response = await fetch(this.codeUrl, options);
    if (!response.ok) {
      throw new Error(`API error - HTTP ${response.status} ${response.statusText}`);
    }

    const code = (await response.json()) as DeviceCodeRes;

    ux.info(`Opening browser to ${code.verification_uri_complete}`);
    // ESM doesn't want to work with mocha so we have this instead
    const open = (await import('open')).default;
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
    ux.action.stop(chalk.green('Logged in'));
  }

  /**
   * Poll the authorization server for an access code, backing off as necessary
   * @param code Code object retrieved from auth server previously
   * @param retry Retry interval
   * @returns Requested token object
   */
  private async pollToken(code: DeviceCodeRes, retry?: number): Promise<TokenRes> {
    await sleep(retry || code.interval);
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=urn:ietf:params:oauth:grant-type:device_code&device_code=${encodeURIComponent(
        code.device_code
      )}&client_id=${this.clientId}`,
    };
    const response = await fetch(this.tokenUrl, options);
    if (!response.ok) {
      const data = await response.json();
      switch (data.error) {
        case 'authorization_pending':
          return this.pollToken(code);
        case 'slow_down':
          return this.pollToken(code, code.interval * 2);
        case 'expired_token':
        case 'invalid_grant':
          throw new Error('Login timed out');
        default:
          throw new Error('Failed to login');
      }
    }

    return response.json();
  }

  /**
   * Save the token to permanent storage
   */
  private async saveToken(): Promise<void> {
    const filePath = path.join(this.config.configDir, 'auth.json');
    await fs.writeJson(filePath, this.token);
  }

  /**
   * Attempt to refresh the access token
   */
  private async refreshToken(): Promise<void> {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&client_id=${this.clientId}&refresh_token=${encodeURIComponent(
        this.token.refresh
      )}`,
    };
    const response = await fetch(this.tokenUrl, options);
    if (!response.ok) {
      throw new Error(
        `Failed to refresh access token - API error - HTTP ${response.status} ${response.statusText}`
      );
    }

    const token = await response.json();
    this.token.token = token.access_token;
    this.token.refresh = token.refresh_token;
    const now = new Date();
    now.setTime(now.getTime() + token.expires_in * 1000);
    this.token.expires = now;
    this.token.mode = Auth.AuthType.Device;
    await this.saveToken();
  }

  /**
   * Load the authentication settings from disk
   */
  private loadAuth(): void {
    const filePath = path.join(this.config.configDir, 'auth.json');
    if (fs.existsSync(filePath)) {
      // Handling for malformed contents?
      this.token = fs.readJsonSync(filePath);
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
      return;
    }

    // If one or both are blank, we don't have valid details
    this.loggedIn = Boolean(this.token.token && this.token.mode);
  }
}

export namespace Auth {
  export enum AuthType {
    Device = 'device',
    Key = 'key',
  }
  export interface Options {
    type?: AuthType;
    key?: string;
  }

  export interface ConfigFile {
    mode: AuthType | undefined;
    token: string;
    refresh: string;
    expires: Date | undefined;
  }
}
