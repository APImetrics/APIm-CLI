import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type InviteList = {
  success: boolean;
  invites: T.Invite[];
};

export default class Invites extends Command<InviteList> {
  static description = 'List all invites in a project';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    ...ux.table.flags(),
    'project-id': Flags.string({
      description: 'ID of project to modify. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<InviteList> {
    const {flags} = await this.parse(Invites);

    if (!this.userConfig.project.current && !flags['project-id']) {
      throw new Error(
        'Current working project not set. Run `apimetrics config project set` first.'
      );
    }

    const projectId = flags['project-id'] ? flags['project-id'] : this.userConfig.project.current;

    const endpoint = `projects/${projectId}/invites/`;
    const invites = await this.api.list<T.Invite>(endpoint);

    ux.table(
      invites,
      {
        email: {
          get: (row) => row.email,
        },
        accessLevel: {
          get: (row) => row.access_level,
        },
        created: {
          get: (row) => row.created,
        },
        invitedBy: {
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
