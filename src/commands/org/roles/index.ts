import {ux} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type RoleList = {
  success: boolean;
  roles: T.Role[];
};

export default class Roles extends Command<RoleList> {
  static description = 'List all roles in an organization';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    ...ux.table.flags(),
  };

  public async run(): Promise<RoleList> {
    const {flags} = await this.parse(Roles);

    if (this.userConfig.organization.current === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (this.userConfig.organization.current === '') {
      throw new Error('organization roles not supported for personal projects.');
    }

    const endpoint = `organizations/${this.userConfig.organization.current}/roles/`;
    const roles = await this.api.list<T.Role>(endpoint);

    ux.table(
      roles,
      {
        role: {
          get: (row) => row.id,
        },
        description: {
          get: (row) => row.description,
        },
        created: {
          get: (row) => row.created,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, roles: roles};
  }
}
