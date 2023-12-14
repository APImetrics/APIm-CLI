import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type InviteList = {
  success: boolean;
  invites: T.Invite[];
};

export default class Invites extends Command<InviteList> {
  static description = 'List all current invites to the Organization.';

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
      description:
        'ID of organization to read. Overrides apimetrics config org set.' +
        'Can be found on the Organization Settings web page.',
      char: 'o',
    }),
  };

  public async run(): Promise<InviteList> {
    const {flags} = await this.parse(Invites);

    const orgId = flags['org-id'] ? flags['org-id'] : this.userConfig.organization.current;
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
        email: {
          get: (row) => row.email,
        },
        roles: {
          get: (row) => row.roles.join(', ') || 'None',
        },
        created: {
          get: (row) => row.created,
        },
        lastLoginIP: {
          header: 'Invited By',
          get: (row) => row.invited_email,
          extended: true,
        },
        id: {
          header: 'ID',
          get: (row) => row.id,
          extended: true,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, invites: invites};
  }
}
