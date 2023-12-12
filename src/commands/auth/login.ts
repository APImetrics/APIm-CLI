import {Flags} from '@oclif/core';

import {Auth, Command} from '../../base-command';

export type LoginJson = {
  message: string;
  success: boolean;
};

export default class Login extends Command<LoginJson> {
  static aliases = ['login'];
  static description = 'Login to APImetrics';
  static examples = ['<%= config.bin %> <%= command.id %> --key <api key>'];
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

    await this.api.login({key: flags.key, type: mode});
    if (mode === Auth.AuthType.Key) {
      this.log('Logged in using API key');
      return {message: 'Logged in using API key', success: true};
    }

    // Get the user to set their org and project
    await this.config.runCommand('config:org:set');
    await this.config.runCommand('config:project:set');

    return {message: 'Logged in using device flow authentication', success: true};
  }
}
