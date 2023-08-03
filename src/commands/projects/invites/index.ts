import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type InviteList = {
  success: boolean;
  invites: T.Invite[];
};

export default class Invites extends Command<InviteList> {
  static description = 'List invites in the project.';

  static examples = [
    `<%= config.bin %> <%= command.id %>
Email             Access Level Created
───────────────── ──────────── ───────────────────────────
alice@example.com VIEWER       2023-08-03T22:28:02.141461Z `,
  ];

  static flags = {
    ...ux.table.flags(),
    'project-id': Flags.string({
      description: 'ID of project to modify. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<InviteList> {
    const {flags} = await this.parse(Invites);
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    if (!this.userConfig.project.current && !flags['project-id']) {
      throw new Error(
        'Current working project not set. Run `apimetrics config project set` first.'
      );
    }

    const invites = await this.api.list<T.Invite>(`projects/${this.api.project}/invites/`);

    ux.table(
      invites,
      {
        email: {
          get: (row) => row.email,
        },
        accessLevel: {
          header: 'Access Level',
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
