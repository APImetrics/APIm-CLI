import {Command as Base, Flags, Interfaces, ux} from '@oclif/core';
import * as fs from 'fs-extra';
import {Api} from './api';

export type Flags<T> = Interfaces.InferredFlags<(typeof Command)['baseFlags'] & T>;
export type Args<T> = Interfaces.InferredArgs<T>;

export type CustomError = Interfaces.CommandError & {skipOclifErrorHandling?: boolean};

export type ErrorJson = {
  success: boolean;
  message: string;
};

export type ConfirmOptions = {
  message: string;
  default: boolean;
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
   * Prompt the user to confirm with default value
   * @param options Message to prompt user with and default response type
   * @returns Did the user select yes (true) or no (false)?
   */
  public async confirm(options: ConfirmOptions): Promise<boolean> {
    const promptOpts = {
      required: false, // We handle empty input ourselves
    };
    const message = `${options.message} [${options.default ? 'y'.toUpperCase() : 'y'}/${
      options.default ? 'n' : 'n'.toUpperCase()
    }]`;
    const response = await ux.prompt(message, promptOpts);
    if (['y', 'yes'].includes(response.toLowerCase())) return true;
    if (['n', 'no'].includes(response.toLowerCase())) return false;
    return options.default;
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

  private formatErrorJson(err: CustomError): string {
    if (this.config.debug && err.stack) {
      return err.stack;
    }

    return JSON.stringify({success: false, message: err.message}, undefined, 2);
  }

  /**
   * Custom error handling for commands.
   * Includes JSON output when --json passed
   */
  protected async catch(err: CustomError): Promise<any> {
    if (this.jsonEnabled()) {
      // Won't have highlighting but for an error this is fine
      console.error(this.formatErrorJson(err));
      err.skipOclifErrorHandling = true; // Prevent extra logs to stderr by run
      throw err;
    } else {
      this.error(err.message);
    }
  }
}
