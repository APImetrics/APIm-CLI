import {Flags} from '@oclif/core';

import {Command} from '../../base-command';

export default class Delete extends Command<{success: boolean}> {
  static description = 'Delete a schedule.';
  static examples = [
    '<%= config.bin %> <%= command.id %> --schedule-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA',
  ];

  static flags = {
    'schedule-id': Flags.string({
      description:
        'Schedule to delete. Can be found by using the command' +
        ' `apimetrics schedules --columns name,id',
      required: true,
    }),
  };

  protected permitKeyAuth = true;

  public async run(): Promise<{success: boolean}> {
    const {flags} = await this.parse(Delete);

    await this.api.delete(`schedules/${flags['schedule-id']}/`);
    return {success: true};
  }
}
