import {Command as Base, Flags, Interfaces, ux} from '@oclif/core';

import {Api} from './api';
import {Config} from './config';

export type Flags<T> = Interfaces.InferredFlags<(typeof Command)['baseFlags'] & T>;
export type Args<T> = Interfaces.InferredArgs<T>;

export type CustomError = Interfaces.CommandError & {skipOclifErrorHandling?: boolean};

export type ErrorJson = {
  message: string;
  stack?: string;
  success: boolean;
};

export type ConfirmOptions = {
  default: boolean;
  message: string;
};

export abstract class Command<T> extends Base {
  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {};
  static enableJsonFlag = true;

  protected api!: Api;

  protected args!: Args<T>;
  protected flags!: Flags<T>;
  protected permitKeyAuth = false;
  protected userConfig!: Config;

  /**
   * Custom error handling for commands.
   * Includes JSON output when --json passed
   */
  protected async catch(err: CustomError): Promise<unknown> {
    // %O Allows us to see the whole object
    this.debug('%O', err);
    if (this.jsonEnabled()) {
      // Won't have highlighting but for an error this is fine
      console.error(this.formatErrorJson(err));
      err.skipOclifErrorHandling = true; // Prevent extra logs to stderr by run
      throw err;
    }

    if (this.config.debug) {
      // This will include the correct stack trace
      this.error(err);
    } else {
      this.error(err.message);
    }
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

  public async init(): Promise<void> {
    await super.init();
    const {args, flags} = await this.parse({
      args: this.ctor.args,
      baseFlags: (super.ctor as typeof Command).baseFlags,
      flags: this.ctor.flags,
      strict: this.ctor.strict,
    });
    this.flags = flags as Flags<T>;
    this.args = args as Args<T>;
    this.userConfig = new Config(this.config);
    this.api = new Api(this.config, this.permitKeyAuth, this.userConfig, this.jsonEnabled());
  }

  private formatErrorJson(err: CustomError): string {
    const res: ErrorJson = {message: err.message, stack: undefined, success: false};
    if (this.config.debug && err.stack) {
      res.stack = err.stack;
    }

    return JSON.stringify(res, undefined, 2);
  }
}
