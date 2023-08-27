import {Flags} from '@oclif/core';
import {Command, T, util} from '../../../base-command';

export type InviteResponse = {
  success: boolean;
  invite: T.Invite;
};

export default class Create extends Command<InviteResponse> {
  static description = 'Create an invite to the project.';
  protected permitKeyAuth = true;

  static examples = [
    `<%= config.bin %> <%= command.id %> --email alice@example.com --access-level editor
ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA`,
  ];

  static flags = {
    email: Flags.string({description: 'Email to send invite to.', required: true}),
    'access-level': Flags.string({
      description: 'Access level.',
      required: true,
      options: ['owner', 'editor', 'analyst', 'viewer'],
    }),
    'project-id': Flags.string({
      description: 'ID of project to modify. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<InviteResponse> {
    const {flags} = await this.parse(Create);
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    if (!util.validateEmail(flags.email)) {
      throw new Error(`Invalid email: ${flags.email}.`);
    }

    const invite = await this.api.post<T.Invite>(
      `projects/${this.api.project}/invites/`,
      {
        body: JSON.stringify({
          email: flags.email,
          // eslint-disable-next-line camelcase
          access_level: flags['access-level'].toUpperCase(),
        }),
      },
      false
    );
    this.log(invite.id);
    return {success: true, invite: invite};
  }
}
