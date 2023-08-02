import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type AccountList = {
  success: boolean;
  roles: T.Access[];
};

export default class Roles extends Command<AccountList> {
  static description = 'List all roles with access to a project';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    ...ux.table.flags(),
    'project-id': Flags.string({
      description: 'ID of project to read. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<AccountList> {
    const {flags} = await this.parse(Roles);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const endpoint = `projects/${this.api.project}/roles/`;
    const accounts = await this.api.list<T.Access>(endpoint);

    ux.table(
      accounts,
      {
        role: {
          get: (row) => row.role_id,
        },
        accessLevel: {
          header: 'Access Level',
          get: (row) => row.access_level,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, roles: accounts};
  }
}
