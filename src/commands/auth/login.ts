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
    key: Flags.string({description: 'API key when using API key auth', required: true}),
  };

  public async run(): Promise<LoginJson> {
    const {flags} = await this.parse(Login);
    // Auth should be moved into API handler
    const auth = new Auth(this.config);
    const mode = Auth.AuthType.Key;
    if (flags.key === '') {
      this.error('No key specified');
    }

    await auth.login({type: mode, key: flags.key});
    this.log('Logged in using API key');
    return {success: true, message: 'Logged in using API key'};
  }
}
