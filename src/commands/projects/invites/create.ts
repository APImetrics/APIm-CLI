import {Flags} from '@oclif/core';
import {Command, T, util} from '../../../base-command';

export type InviteResponse = {
  success: boolean;
  invite: T.Invite;
};

export default class Create extends Command<InviteResponse> {
  static description = 'Create an invite to the project';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    email: Flags.string({description: 'Email to send invite to', required: true}),
    'access-level': Flags.string({
      description: 'Access Level',
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

    if (!util.validateEmail(flags.email)) {
      throw new Error(`Invalid email: ${flags.email}`);
    }

    if (!this.userConfig.project.current && !flags['project-id']) {
      throw new Error(
        'Current working project not set. Run `apimetrics config project set` first.'
      );
    }

    const projectId = flags['project-id'] ? flags['project-id'] : this.userConfig.project.current;

    const endpoint = `projects/${projectId}/invites/`;
    const data = {
      email: flags.email,
      // eslint-disable-next-line camelcase
      access_level: flags['access-level'].toUpperCase(),
    };
    const invite = await this.api.post<T.Invite>(endpoint, {body: JSON.stringify(data)}, false);
    this.log(invite.id);
    return {success: true, invite: invite};
  }
}
