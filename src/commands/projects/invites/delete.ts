import {Flags} from '@oclif/core';
import {Command} from '../../../base-command/index.js';
export default class Delete extends Command<{success: boolean}> {
  static description = 'Delete an invite to the project.';
  protected permitKeyAuth = true;

  static examples = [
    '<%= config.bin %> <%= command.id %> --invite-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA',
  ];

  static flags = {
    'invite-id': Flags.string({description: 'Invite to delete.', required: true}),
  };

  public async run(): Promise<{success: boolean}> {
    const {flags} = await this.parse(Delete);

    await this.api.delete(`projects/${this.api.project}/invites/${flags['invite-id']}/`);
    return {success: true};
  }
}
