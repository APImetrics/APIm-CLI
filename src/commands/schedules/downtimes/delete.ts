import {Flags} from '@oclif/core';

import {Command} from '../../../base-command';

export default class Delete extends Command<{success: boolean}> {
  static description = 'Delete a downtime for a Schedule.';
  static examples = [
    '<%= config.bin %> <%= command.id %> --downtime-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA',
  ];

  static flags = {
    'downtime-id': Flags.string({
      description:
        'Downtime to delete. Can be found using the command' +
        '`apimetrics schedules downtimes --columns id',
      required: true,
    }),
    'project-id': Flags.string({
      char: 'p',
      description:
        'ID of project to modify. Overrides apimetrics config project set.' +
        ' Can be found in the Project Settings web page under the admin' +
        ' section or by using the command `apimetrics projects --columns name,id`.',
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
