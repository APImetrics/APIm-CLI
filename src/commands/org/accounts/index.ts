import {Flags, ux} from '@oclif/core';

import {Command, T} from '../../../base-command';

export type AccountList = {
  accounts: T.OrgAccount[];
  success: boolean;
};

export default class Accounts extends Command<AccountList> {
  static description = 'List all users in organization.';

  static examples = [
    `<%= config.bin %> <%= command.id %>
Name              Email             Roles                    Last login
───────────────── ───────────────── ──────────────────────── ────────────────────────
alice@example.com alice@example.com DEFAULT                  2023-08-02T21:15:48.072Z
Bob               bob@example.com   DEFAULT, ADMIN, DEV_TEAM 2023-08-01T23:41:07.733Z `,
    `<%= config.bin %> <%= command.id %>
Name              ID
───────────────── ──────────────────────────────
alice@example.com auth0|abcdefghijklmnopqrstuvwx
Bob               auth0|zyxwvutsrqponmlkjihgfedc`,
  ];

  static flags = {
    ...ux.table.flags(),
    'org-id': Flags.string({
      char: 'o',
      description: 'ID of organization to read. Overrides apimetrics config org set.',
    }),
  };

  public async run(): Promise<AccountList> {
    const {flags} = await this.parse(Accounts);

    const orgId = flags['org-id'] ? flags['org-id'] : this.userConfig.organization.current;
    if (orgId === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (orgId === '') {
      throw new Error(
        'Personal projects not currently supported. Please use web interface instead.'
      );
    }

    const endpoint = `organizations/${orgId}/accounts`;
    const accounts = await this.api.list<T.OrgAccount>(endpoint);

    ux.table(
      accounts,
      {
        email: {
          get: (row) => row.email,
        },
        id: {
          extended: true,
          get: (row) => row.user_id,
          header: 'ID',
        },
        lastLogin: {
          get: (row) => row.last_login,
          header: 'Last Login',
        },
        lastLoginIP: {
          extended: true,
          get: (row) => row.last_ip,
          header: 'Login IP',
        },
        loginCount: {
          extended: true,
          get: (row) => row.logins_count,
          header: 'Login Count',
        },
        name: {
          get: (row) => row.name,
        },
        roles: {
          get(row) {
            // The location of permissions is not consistent, hence we need
            // to check a couple of different places
            if (row.app_metadata) {
              if (
                row.app_metadata.org_roles &&
                (row.app_metadata.org_roles as Record<string, string[]>)[orgId]
              ) {
                return (row.app_metadata.org_roles as Record<string, string[]>)[orgId].join(', ');
              }

              if (row.app_metadata[orgId]) {
                return (row.app_metadata[orgId] as string[]).join(', ');
              }
            }

            if (row.permissions) {
              return row.permissions.join(', ');
            }

            return '';
          },
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
