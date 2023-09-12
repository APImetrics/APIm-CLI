import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type AccountList = {
  success: boolean;
  accounts: T.OrgAccount[];
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
      description: 'ID of organization to read. Overrides apimetrics config org set.',
      char: 'o',
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
        name: {
          get: (row) => row.name,
        },
        email: {
          get: (row) => row.email,
        },
        roles: {
          get: (row) => {
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
        lastLogin: {
          header: 'Last Login',
          get: (row) => row.last_login,
        },
        lastLoginIP: {
          header: 'Login IP',
          get: (row) => row.last_ip,
          extended: true,
        },
        loginCount: {
          header: 'Login Count',
          get: (row) => row.logins_count,
          extended: true,
        },
        id: {
          header: 'ID',
          get: (row) => row.user_id,
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
