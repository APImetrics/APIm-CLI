import {ux} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type AccountList = {
  success: boolean;
  accounts: T.OrgAccount[];
};

export default class Accounts extends Command<AccountList> {
  static description = 'List all users in organisation';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    ...ux.table.flags(),
  };

  public async run(): Promise<AccountList> {
    const {flags} = await this.parse(Accounts);

    let currentOrg: string;
    if (this.userConfig.organisation.current) {
      currentOrg = this.userConfig.organisation.current;
    } else {
      throw new Error('Current organisation not set. Run `apimetrics config org set` first.');
    }

    const endpoint = `organizations/${this.userConfig.organisation.current}/accounts`;
    const {results: accounts} = await this.api.get<T.ListResponse<T.OrgAccount>>(
      endpoint,
      undefined,
      false
    );

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
                (row.app_metadata.org_roles as Record<string, string[]>)[currentOrg]
              ) {
                return (row.app_metadata.org_roles as Record<string, string[]>)[currentOrg].join(
                  ', '
                );
              }

              if (row.app_metadata[currentOrg]) {
                return (row.app_metadata[currentOrg] as string[]).join(', ');
              }
            }

            if (row.permissions) {
              return row.permissions.join(', ');
            }

            return '';
          },
        },
        lastLogin: {
          header: 'Last login',
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
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, accounts: accounts};
  }
}
