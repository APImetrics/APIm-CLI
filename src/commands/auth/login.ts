import {Flags} from '@oclif/core';
import {Command, Auth} from '../../base-command';

export type LoginJson = {
  success: boolean;
  message: string;
};

export default class Login extends Command<LoginJson> {
  static description = 'Login to APImetrics';

  static examples = ['<%= config.bin %> <%= command.id %> --key <api key>'];

  static aliases = ['login'];

  static flags = {
    key: Flags.string({description: 'API key when using API key auth', required: false}),
  };

  public async run(): Promise<LoginJson> {
    const {flags} = await this.parse(Login);

    const mode = flags.key ? Auth.AuthType.Key : Auth.AuthType.Device;
    if (mode === Auth.AuthType.Key && flags.key === '') {
      this.error('No key specified');
    }

    if (mode === Auth.AuthType.Device && flags.json) {
      throw new Error('Cannot use --json with device flow authentication. Use --key instead.');
    }

    await this.api.login({type: mode, key: flags.key});
    if (mode === Auth.AuthType.Key) {
      this.log('Logged in using API key');
      return {success: true, message: 'Logged in using API key'};
    }

    return {success: true, message: 'Logged in using device flow authentication'};
  }
}
