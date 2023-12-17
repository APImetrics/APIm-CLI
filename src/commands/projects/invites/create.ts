import {Flags} from '@oclif/core';

import {Command, T, util} from '../../../base-command';

export type InviteResponse = {
  invite: T.Invite;
  success: boolean;
};

export default class Create extends Command<InviteResponse> {
  static description = 'Create an invite to the project.';
  static examples = [
    `<%= config.bin %> <%= command.id %> --email alice@example.com --access-level editor
ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA`,
  ];

  static flags = {
    'access-level': Flags.string({
      description: 'Access level.',
      options: ['owner', 'editor', 'analyst', 'viewer'],
      required: true,
    }),
    email: Flags.string({description: 'Email to send invite to.', required: true}),
    'project-id': Flags.string({
      char: 'p',
      description:
        'ID of project to modify. Overrides apimetrics config project set.' +
        ' Can be found in the Project Settings web page under the admin' +
        ' section or by using the command `apimetrics projects --columns name,id`.',
    }),
  };

  protected permitKeyAuth = true;

  public async run(): Promise<InviteResponse> {
    const {flags} = await this.parse(Create);
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    if (!util.validateEmail(flags.email)) {
      throw new Error(`Invalid email: ${flags.email}.`);
    }

    const invite = await this.api.post<T.Invite>(`projects/${this.api.project}/invites/`, {
      body: {
        // eslint-disable-next-line camelcase
        access_level: flags['access-level'].toUpperCase(),
        email: flags.email,
      },
    });
    this.log(invite.id);
    return {invite, success: true};
  }
}
