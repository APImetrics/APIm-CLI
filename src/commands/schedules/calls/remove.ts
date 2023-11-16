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
    'schedule-id': Flags.string({
      description: 'ID of schedule to modify.',
      char: 's',
      required: true,
    }),
    'call-id': Flags.string({
      description: 'ID of call to remove.',
      char: 'c',
      required: true,
    }),
  };

  public async run(): Promise<Schedule> {
    const {flags} = await this.parse(Remove);
    const schedule = await this.api.delete<T.Schedule>(
      `schedules/${flags['schedule-id']}/call/${flags['call-id']}`,
      {}
    );
    return {success: true, schedule: schedule};
  }
}
