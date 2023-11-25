import {Flags} from '@oclif/core';
import {Command, T} from '../../../base-command/index.js';

export type Schedule = {
  success: boolean;
  schedule: T.Schedule;
};

export default class Add extends Command<Schedule> {
  static description = 'Add call to schedule.';
  protected permitKeyAuth = true;

  static examples = [
    '<%= config.bin %> <%= command.id %> --schedule-id ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Pbn4ZILDA --call-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9f3DuAoM',
  ];

  static aliases = ['calls:schedules:add'];

  static flags = {
    'schedule-id': Flags.string({
      description: 'ID of schedule to modify.',
      char: 's',
      required: true,
    }),
    'call-id': Flags.string({
      description: 'ID of call to add.',
      char: 'c',
      required: true,
    }),
  };

  public async run(): Promise<Schedule> {
    const {flags} = await this.parse(Add);

    const schedule = await this.api.post<T.Schedule>(
      `schedules/${flags['schedule-id']}/call/${flags['call-id']}`,
      {} // No body for this POST request
    );
    return {success: true, schedule: schedule};
  }
}
