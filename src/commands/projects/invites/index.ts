import {Flags, ux} from '@oclif/core';

import {Command, T} from '../../../base-command';

export type InviteList = {
  invites: T.Invite[];
  success: boolean;
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
      char: 'p',
      description:
        'ID of project to read. Overrides apimetrics config project set.' +
        ' Can be found in the Project Settings web page under the admin' +
        ' section or by using the command `apimetrics projects --columns name,id`.',
    }),
  };

  protected permitKeyAuth = true;

  public async run(): Promise<InviteList> {
    const {flags} = await this.parse(Invites);
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const invites = await this.api.list<T.Invite>(`projects/${this.api.project}/invites/`);

    ux.table(
      invites,
      {
        accessLevel: {
          get: (row) => row.access_level,
          header: 'Access Level',
        },
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
        invitedBy: {
          extended: true,
          get: (row) => row.invited_email,
          header: 'Invited By',
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
