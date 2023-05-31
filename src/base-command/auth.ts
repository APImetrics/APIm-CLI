import {Interfaces} from '@oclif/core';
import path = require('path');
import * as fs from 'fs-extra';

export class Auth {
  authServer = process.env.APIMETRICS_AUTH_SERVER || 'https://auth.apimetrics.io';

  /** Is the user considered to be logged in? */
  public loggedIn = false;

  private token = '';
  private mode: Auth.AuthType | undefined;

  constructor(private readonly config: Interfaces.Config) {}

  /**
   * Attempt to login the user
   * @param options Login options passed by user
   */
  public async login(options: Auth.Options): Promise<void> {
    if (!options.type) {
      options.type = options.key ? Auth.AuthType.Key : Auth.AuthType.Bearer;
    }

    switch (options.type) {
      case Auth.AuthType.Key:
        await this.key(options.key);
        break;

      case Auth.AuthType.Bearer:
        await this.oauth();
        break;
    }

    await this.saveToken();
  }

  private async oauth(): Promise<void> {
    // Pass
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
        this.token = key;
        this.mode = Auth.AuthType.Key;
      } else {
        throw new Error(`API key is malformed. Expected 32 characters, got ${key.length}`);
      }
    } else {
      throw new Error('No API key defined for API authentication method');
    }
  }

  /**
   * Save the token to permanent storage
   */
  private async saveToken(): Promise<void> {
    const filePath = path.join(this.config.configDir, 'auth.json');
    await fs.writeJson(filePath, {mode: this.mode, token: this.token});
  }
}

export namespace Auth {
  export enum AuthType {
    Bearer = 'bearer',
    Key = 'key',
  }
  export interface Options {
    type?: AuthType;
    key?: string;
  }
}
