import {Flags, ux} from '@oclif/core';

import {Command, T} from '../../../base-command';

export type RoleList = {
  roles: T.Access[];
  success: boolean;
};

export default class Roles extends Command<RoleList> {
  static description = 'List all roles with access to the Project.';

  static examples = [
    `<%= config.bin %> <%= command.id %>
Role      Access Level
───────── ────────────
DEBUGGING EDITOR
DEBUGGING ANALYST
DEFAULT   EDITOR
DEV_TEAM  EDITOR
ADMIN     VIEWER  `,
  ];

  static flags = {
    ...ux.table.flags(),
    'project-id': Flags.string({
      char: 'p',
      description:
        'ID of project to read. Overrides apimetrics config project set.' +
        ' Can be found in the Project Settings web page under the admin' +
        ' section or by using the command `apimetrics projects --columns name,id`.',
    }),
  };

  public async run(): Promise<RoleList> {
    const {flags} = await this.parse(Roles);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const roles = await this.api.list<T.Access>(`projects/${this.api.project}/roles/`);

    ux.table(
      roles,
      {
        accessLevel: {
          get: (row) => row.access_level,
          header: 'Access Level',
        },
        role: {
          get: (row) => row.role_id,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {roles, success: true};
  }
}
