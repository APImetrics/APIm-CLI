import {Flags, ux} from '@oclif/core';

import {Command, T} from '../../../base-command';

export type InviteList = {
  invites: T.Invite[];
  success: boolean;
};

export default class Invites extends Command<InviteList> {
  static description = 'List invites in an organization.';

  static examples = [
    `<%= config.bin %> <%= command.id %>
Email             Roles    Created
───────────────── ──────── ───────────────────────────
bob@example.com   ADMIN    2023-07-15T18:32:41.626327Z
alice@example.com DEV_TEAM 2023-07-15T18:34:27.044198Z`,
  ];

  static flags = {
    ...ux.table.flags(),
    'org-id': Flags.string({
      char: 'o',
      description: 'ID of organization to read. Overrides apimetrics config org set.',
    }),
  };

  public async run(): Promise<InviteList> {
    const {flags} = await this.parse(Invites);

    const orgId = flags['org-id'] ?? this.userConfig.organization.current;
    if (orgId === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (orgId === '') {
      throw new Error('Organization invites not supported for personal projects.');
    }

    const endpoint = `organizations/${orgId}/invites/`;
    const invites = await this.api.list<T.Invite>(endpoint);

    ux.table(
      invites,
      {
        created: {
          get: (row) => row.created,
        },
        email: {
          get: (row) => row.email,
        },
        id: {
          extended: true,
          get: (row) => row.id,
          header: 'ID',
        },
        lastLoginIP: {
          extended: true,
          get: (row) => row.invited_email,
          header: 'Invited By',
        },
        roles: {
          get: (row) => row.roles.join(', ') || 'None',
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {invites, success: true};
  }
}
