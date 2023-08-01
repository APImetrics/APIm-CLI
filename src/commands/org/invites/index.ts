import {ux} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type InviteList = {
  success: boolean;
  invites: T.Invite[];
};

export default class Invites extends Command<InviteList> {
  static description = 'List all invites in an organization';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    ...ux.table.flags(),
  };

  public async run(): Promise<InviteList> {
    const {flags} = await this.parse(Invites);

    if (this.userConfig.organization.current === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (this.userConfig.organization.current === '') {
      throw new Error('organization invites not supported for personal projects.');
    }

    const endpoint = `organizations/${this.userConfig.organization.current}/invites/`;
    const {results: invites} = await this.api.get<T.ListResponse<T.Invite>>(
      endpoint,
      undefined,
      false
    );

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
