import {Flags} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type Schedule = {
  success: boolean;
  schedule: T.Schedule;
};

export default class Remove extends Command<Schedule> {
  static description = 'Remove call from schedule';
  protected permitKeyAuth = true;

  static examples = [
    '<%= config.bin %> <%= command.id %> --schedule-id ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Pbn4ZILDA --call-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXRjklafJhslw62dahoM',
  ];

  static aliases = ['calls:schedules:delete'];

  static flags = {
    'project-id': Flags.string({
      description:
        'ID of project to modify. Overrides apimetrics config project set.' +
        ' Can be found in the Project Settings web page under the admin' +
        ' section or by using the command `apimetrics projects --columns name,id`.',
      char: 'p',
    }),
    'schedule-id': Flags.string({
      description:
        'ID of schedule to modify. Can be found by using the command' +
        ' `apimetrics schedules --columns name,id`.',
      char: 's',
      required: true,
    }),
    'call-id': Flags.string({
      description:
        'ID of call to add. Can be found in the expanded Audit Logs of the desired' +
        ' API call in the Audit tab web page or by using the command' +
        ' `apimetrics calls --columns name,id`.',
      char: 'c',
      required: true,
    }),
  };

  public async run(): Promise<Schedule> {
    const {flags} = await this.parse(Remove);
    const endpoint = `schedules/${flags['schedule-id']}/call/${flags['call-id']}`;
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const schedule = await this.api.delete<T.Schedule>(endpoint, {});
    return {success: true, schedule: schedule};
  }
}
