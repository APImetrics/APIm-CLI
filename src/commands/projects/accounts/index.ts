import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type AccountList = {
  success: boolean;
  accounts: T.Access[];
};

export default class Accounts extends Command<AccountList> {
  static description = 'List all users with access to a project';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    ...ux.table.flags(),
    'project-id': Flags.string({
      description: 'ID of project to read. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<AccountList> {
    const {flags} = await this.parse(Accounts);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const endpoint = `projects/${this.api.project}/access/`;
    const accounts = await this.api.list<T.Access>(endpoint);

    ux.table(
      accounts,
      {
        email: {
          get: (row) => row.account_email,
        },
        accessLevel: {
          header: 'Access Level',
          get: (row) => row.access_level,
        },
        userId: {
          header: 'User ID',
          get: (row) => row.account_id,
          extended: true,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, accounts: accounts};
  }
}
