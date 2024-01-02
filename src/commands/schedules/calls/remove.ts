import {Flags} from '@oclif/core';

import {Command, T} from '../../../base-command';

export type Schedule = {
  schedule: T.Schedule;
  success: boolean;
};

export default class Remove extends Command<Schedule> {
  static aliases = ['calls:schedules:delete'];
  static description = 'Remove call from schedule';

  static examples = [
    '<%= config.bin %> <%= command.id %> --schedule-id ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Pbn4ZILDA --call-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXRjklafJhslw62dahoM',
  ];

  static flags = {
    'call-id': Flags.string({
      char: 'c',
      description:
        'ID of call to remove. Can be found in the expanded Audit Logs of the desired' +
        ' API call in the Audit tab web page or by using the command' +
        ' `apimetrics calls --columns name,id`.',
      required: true,
    }),
    'schedule-id': Flags.string({
      char: 's',
      description:
        'ID of schedule to modify. Can be found by using the command' +
        ' `apimetrics schedules --columns name,id`.',
      required: true,
    }),
  };

  protected permitKeyAuth = true;

  public async run(): Promise<Schedule> {
    const {flags} = await this.parse(Remove);
    const schedule = await this.api.delete<T.Schedule>(
      `schedules/${flags['schedule-id']}/call/${flags['call-id']}`,
      {}
    );
    return {schedule, success: true};
  }
}
