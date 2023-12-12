import {Flags} from '@oclif/core';

import {Command, T} from '../../../base-command';

export type Schedule = {
  schedule: T.Schedule;
  success: boolean;
};

export default class Add extends Command<Schedule> {
  static aliases = ['calls:schedules:add'];
  static description = 'Add call to schedule.';

  static examples = [
    '<%= config.bin %> <%= command.id %> --schedule-id ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Pbn4ZILDA --call-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9f3DuAoM',
  ];

  static flags = {
    'call-id': Flags.string({
      char: 'c',
      description: 'ID of call to add.',
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
    const {flags} = await this.parse(Add);

    const schedule = await this.api.post<T.Schedule>(
      `schedules/${flags['schedule-id']}/call/${flags['call-id']}`,
      {} // No body for this POST request
    );
    return {schedule, success: true};
  }
}
