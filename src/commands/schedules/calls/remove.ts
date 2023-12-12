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
      description: 'ID of call to remove.',
      required: true,
    }),
    'schedule-id': Flags.string({
      char: 's',
      description: 'ID of schedule to modify.',
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
