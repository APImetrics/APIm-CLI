import {Flags} from '@oclif/core';
import {Command, Auth} from '../../base-command';

export default class Login extends Command<typeof Login> {
  static description = 'Login to APImetrics';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --key <api key>',
  ];

  static aliases = ['login'];

  static flags = {
    key: Flags.string({description: 'API key when using API key auth'}),
  };

  public async run(): Promise<void> {
    const {flags} = await this.parse(Login);
    // Auth should be moved into API handler
    const auth = new Auth(this.config);
    let mode;
    if (flags.key) {
      mode = Auth.AuthType.Key;
    } else if (flags.key === '') {
      this.error('No key specified');
    } else {
      mode = Auth.AuthType.Bearer;
    }

    await auth.login({type: mode, key: flags.key});
    if (mode === Auth.AuthType.Bearer) {
      this.log('Logged in using OAuth');
    } else if (mode === Auth.AuthType.Key) {
      this.log('Logged in using API key');
    }
  }
}
