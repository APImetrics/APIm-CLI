import {Interfaces} from '@oclif/core';
import path = require('path');
import * as fs from 'fs-extra';

export class Auth {
  /** Is the user considered to be logged in? */
  public loggedIn = false;

  private token = '';
  private mode: Auth.AuthType | undefined;

  constructor(private readonly config: Interfaces.Config) {
    this.loadAuth();
  }

  /**
   * Attempt to login the user
   * @param options Login options passed by user
   */
  public async login(options: Auth.Options): Promise<void> {
    // Force API key auth - OAuth not yet implemented
    options.type = Auth.AuthType.Key;

    await this.key(options.key);
    await this.saveToken();
    this.loggedIn = true;
  }

  /**
   * Formatted authorization header including credentials
   */
  public get header(): string {
    return `Authorization: Bearer ${this.token}`;
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

  /**
   * Load the authentication settings from disk
   */
  private loadAuth(): void {
    const filePath = path.join(this.config.configDir, 'auth.json');
    if (fs.existsSync(filePath)) {
      // Handling for malformed contents?
      const auth: Auth.ConfigFile = fs.readJsonSync(filePath);
      this.token = auth.token;
      this.mode = auth.mode;
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
      return;
    }

    // If one or both are blank, we don't have valid details
    this.loggedIn = Boolean(this.token && this.mode);
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

  export interface ConfigFile {
    mode: AuthType | undefined;
    token: string;
  }
}
