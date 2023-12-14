import {Flags} from '@oclif/core';
import {Command} from '../../base-command';

export default class Delete extends Command<{success: boolean}> {
  static description = 'Delete a schedule.';
  protected permitKeyAuth = true;

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
    'project-id': Flags.string({
      description:
        'ID of project to modify. Overrides apimetrics config project set.' +
        ' Can be found in the Project Settings web page under the admin' +
        ' section or by using the command `apimetrics projects --columns name,id`.',
      char: 'p',
    }),
  };

  public async run(): Promise<{success: boolean}> {
    const {flags} = await this.parse(Delete);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    await this.api.delete(`schedules/${flags['schedule-id']}/`);
    return {success: true};
  }
}
