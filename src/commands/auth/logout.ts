import {Command} from '../../base-command';

export type LogoutJson = {
  message: string;
  success: boolean;
};

export default class Logout extends Command<LogoutJson> {
  static description = 'Logout of APImetrics CLI.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  public async run(): Promise<LogoutJson> {
    await this.api.logout();
    this.log('Logged out');
    return {message: 'Logged out', success: true};
  }
}
