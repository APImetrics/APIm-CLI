import {Command as Base, Flags, Interfaces} from '@oclif/core';
import * as fs from 'fs-extra';
import {Api} from './api';

export type Flags<T> = Interfaces.InferredFlags<(typeof Command)['baseFlags'] & T>;
export type Args<T> = Interfaces.InferredArgs<T>;

export type ErrorJson = {
  success: boolean;
  message: string;
};

export abstract class Command<T> extends Base {
  static enableJsonFlag = true;

  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {};

  protected flags!: Flags<T>;
  protected args!: Args<T>;
  protected api!: Api;

  public async init(): Promise<void> {
    await super.init();
    const {args, flags} = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof Command).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    });
    this.flags = flags as Flags<T>;
    this.args = args as Args<T>;
    this.api = new Api(this.config);
    await this.initConfig();
  }

  /**
   * Ensure that required config directories are present
   */
  private async initConfig(): Promise<void> {
    if (!(await fs.exists(this.config.configDir))) {
      this.debug(`Creating ${this.config.configDir}`);
      await fs.mkdir(this.config.configDir);
    }
  }

  /**
   * Custom error handling for commands.
   * Includes JSON output when --json passed
   */
  protected async catch(err: Interfaces.CommandError): Promise<any> {
    if (this.jsonEnabled()) {
      // Won't have highlighting but for an error this is fine
      this.error(JSON.stringify({success: false, message: err.message}));
    } else {
      this.error(err.message);
    }
  }
}
