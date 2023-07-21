import {ux} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type RoleList = {
  success: boolean;
  roles: T.Role[];
};

export default class Roles extends Command<RoleList> {
  static description = 'List all roles in an organisation';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    ...ux.table.flags(),
  };

  public async run(): Promise<RoleList> {
    const {flags} = await this.parse(Roles);

    if (this.userConfig.organisation.current === undefined) {
      throw new Error('Current organisation not set. Run `apimetrics config org set` first.');
    } else if (this.userConfig.organisation.current === '') {
      throw new Error('Organisation roles not supported for personal projects.');
    }

    const endpoint = `organizations/${this.userConfig.organisation.current}/roles/`;
    const {results: roles} = await this.api.get<T.ListResponse<T.Role>>(endpoint, undefined, false);

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
