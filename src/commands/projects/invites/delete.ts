import {Flags} from '@oclif/core';
import {Command} from '../../../base-command';
export default class Delete extends Command<{success: boolean}> {
  static description = 'Delete an invite to the project.';
  protected permitKeyAuth = true;

  static examples = [
    '<%= config.bin %> <%= command.id %> --invite-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA',
  ];

  static flags = {
    'invite-id': Flags.string({description: 'Invite to delete.', required: true}),
    'project-id': Flags.string({
      description: 'ID of project to modify. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<{success: boolean}> {
    const {flags} = await this.parse(Delete);

    const projectId = flags['project-id'] ? flags['project-id'] : this.userConfig.project.current;
    await this.api.delete(`projects/${projectId}/invites/${flags['invite-id']}/`);
    return {success: true};
  }
}
