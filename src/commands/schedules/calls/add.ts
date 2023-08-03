import {Flags} from '@oclif/core';
import {Command, T} from '../../../base-command';

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
    'project-id': Flags.string({
      description: 'ID of project to modify. Overrides apimetrics config project set.',
      char: 'p',
    }),
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
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const schedule = await this.api.post<T.Schedule>(
      `schedules/${flags['schedule-id']}/call/${flags['call-id']}`,
      {} // No body for this POST request
    );
    return {success: true, schedule: schedule};
  }
}
