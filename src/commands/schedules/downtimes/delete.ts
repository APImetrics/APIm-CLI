import {Flags} from '@oclif/core';

import {Command} from '../../../base-command';

export default class Delete extends Command<{success: boolean}> {
  static description = 'Delete a downtime.';
  static examples = [
    '<%= config.bin %> <%= command.id %> --downtime-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA',
  ];

  static flags = {
    'downtime-id': Flags.string({description: 'Downtime to delete.', required: true}),
    'project-id': Flags.string({
      char: 'p',
      description: 'ID of project to modify. Overrides apimetrics config project set.',
    }),
  };

  protected permitKeyAuth = true;

  public async run(): Promise<{success: boolean}> {
    const {flags} = await this.parse(Delete);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    await this.api.delete(`schedules/downtime/${flags['downtime-id']}/`);
    return {success: true};
  }
}
