import {Flags, ux} from '@oclif/core';

import {Command, T} from '../../../base-command';

export type RoleList = {
  roles: T.Role[];
  success: boolean;
};

export default class Roles extends Command<RoleList> {
  static description = 'List all roles within the Organization.';

  static examples = [
    `<%= config.bin %> <%= command.id %>
Role   Description                     Created
────── ─────────────────────────────── ───────────────────────────
ADMIN  Organization Administrator Role 2021-02-25T01:53:42.656838Z
TEAM_A Development team A              2023-07-16T21:53:30.522729Z`,
  ];

  static flags = {
    ...ux.table.flags({except: ['extended']}),
    'org-id': Flags.string({
      char: 'o',
      description:
        'ID of organization to read. Overrides apimetrics config org set.' +
        'Can be found on the Organization Settings web page.',
    }),
  };

  public async run(): Promise<RoleList> {
    const {flags} = await this.parse(Roles);

    const orgId = flags['org-id'] ?? this.userConfig.organization.current;
    if (orgId === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (orgId === '') {
      throw new Error('Organization roles not supported for personal projects.');
    }

    const endpoint = `organizations/${orgId}/roles/`;
    const roles = await this.api.list<T.Role>(endpoint);

    ux.table(
      roles,
      {
        created: {
          get: (row) => row.created,
        },
        description: {
          get: (row) => row.description,
        },
        role: {
          get: (row) => row.id,
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
