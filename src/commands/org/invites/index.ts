import {ux} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type InviteList = {
  success: boolean;
  invites: T.Invite[];
};

export default class Invites extends Command<InviteList> {
  static description = 'List all invites in an organisation';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    ...ux.table.flags(),
  };

  public async run(): Promise<InviteList> {
    const {flags} = await this.parse(Invites);

    if (!this.userConfig.organisation.current) {
      throw new Error('Current organisation not set. Run `apimetrics config org set` first.');
    }

    const endpoint = `organizations/${this.userConfig.organisation.current}/invites/`;
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
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, invites: invites};
  }
}
