import {Flags} from '@oclif/core';
import {Command} from '../../base-command';

export default class Delete extends Command<{success: boolean}> {
  static description = 'Delete a schedule.';
  protected permitKeyAuth = true;

  static examples = [
    '<%= config.bin %> <%= command.id %> --workflow-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA',
  ];

  static flags = {
    'workflow-id': Flags.string({description: 'Workflow to delete.', required: true}),
  };

  public async run(): Promise<{success: boolean}> {
    const {flags} = await this.parse(Delete);
    await this.api.delete(`workflows/${flags['workflow-id']}/`);
    return {success: true};
  }
}
