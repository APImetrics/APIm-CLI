import {Flags, ux} from '@oclif/core';

import {Command, T} from '../../../base-command';

export type AccountList = {
  accounts: T.Access[];
  success: boolean;
};

export default class Accounts extends Command<AccountList> {
  static description = 'List users with access to the project.';

  static examples = [
    `<%= config.bin %> <%= command.id %>
Email             Access Level
───────────────── ────────────
bob@example.com   VIEWER
alice@example.com OWNER
`,
  ];

  static flags = {
    ...ux.table.flags(),
    'project-id': Flags.string({
      char: 'p',
      description: 'ID of project to read. Overrides apimetrics config project set.',
    }),
  };

  public async run(): Promise<AccountList> {
    const {flags} = await this.parse(Accounts);
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const accounts = await this.api.list<T.Access>(`projects/${this.api.project}/access/`);

    ux.table(
      accounts,
      {
        accessLevel: {
          get: (row) => row.access_level,
          header: 'Access Level',
        },
        email: {
          get: (row) => row.account_email,
        },
        userId: {
          extended: true,
          get: (row) => row.account_id,
          header: 'User ID',
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {accounts, success: true};
  }
}
