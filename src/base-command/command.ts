import {Command as Base, Flags, Interfaces} from '@oclif/core';
import * as fs from 'fs-extra';

export type Flags<T extends typeof Base> = Interfaces.InferredFlags<
  (typeof Command)['baseFlags'] & T['flags']
>;
export type Args<T extends typeof Base> = Interfaces.InferredArgs<T['args']>;

export abstract class Command<T extends typeof Base> extends Base {
  static enableJsonFlag = true;

  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {};

  protected flags!: Flags<T>;
  protected args!: Args<T>;

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

  protected async catch(err: Interfaces.CommandError): Promise<any> {
    this.error(err.message);
  }
}
