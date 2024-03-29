import {Flags} from '@oclif/core';

import {Command, T} from '../../../base-command';

export type Downtime = {
  downtime: T.Downtime;
  success: boolean;
};

export default class Create extends Command<Downtime> {
  static description = 'Create downtime for a Schedule.';
  static examples = [
    `
<%= config.bin %> <%= command.id %> --schedule-id pPbCtcWNyMwsSDU --start 2023-07-21T18:32:00Z --end 2023-07-21T19:32:00Z
ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA`,
  ];

  static flags = {
    end: Flags.string({
      description: 'Date and time to end downtime in Date Time format (YYYY-MM-DDTHH:mm:ss.sssZ).',
      required: true,
    }),
    repeat: Flags.string({
      description: 'Repeat this downtime at the set interval.',
      options: ['daily', 'weekly'],
    }),
    'schedule-id': Flags.string({
      description:
        'Schedule to modify. Can be found by using the command' +
        ' `apimetrics schedules --columns name,id',
      required: true,
    }),
    start: Flags.string({
      description:
        'Date and time to start downtime in Date Time format (YYYY-MM-DDTHH:mm:ss.sssZ).',
      required: true,
    }),
  };

  protected permitKeyAuth = true;

  public async run(): Promise<Downtime> {
    const {flags} = await this.parse(Create);

    let repeat = 0;
    switch (flags.repeat) {
      case 'daily': {
        repeat = 1;
        break;
      }

      case 'weekly': {
        repeat = 7;
        break;
      }
    }

    const start = new Date(flags.start);
    try {
      // This will throw a range error if the date created above is invalid
      start.toISOString();
    } catch (error) {
      if (error instanceof RangeError) {
        throw new Error(
          `Invalid value for start. Could not parse ${flags.start} into a date and time.`
        );
      }

      throw error;
    }

    const end = new Date(flags.end);
    try {
      // This will throw a range error if the date created above is invalid
      end.toISOString();
    } catch (error) {
      if (error instanceof RangeError) {
        throw new Error(
          `Invalid value for end. Could not parse ${flags.end} into a date and time.`
        );
      }

      throw error;
    }

    if (start > end) {
      throw new Error(
        `End date (${end.toISOString()}) is before start date (${start.toISOString()}).`
      );
    }

    const body: T.Downtime['schedule'] = {
      // eslint-disable-next-line camelcase
      end_time: end.toISOString(),
      // eslint-disable-next-line camelcase
      repeat_days: repeat,
      repeated: Boolean(flags.repeat),
      // eslint-disable-next-line camelcase
      start_time: start.toISOString(),
    };

    const downtime = await this.api.post<T.Downtime>(
      `schedules/${flags['schedule-id']}/downtime/`,
      {body: {downtime: body}}
    );
    this.log(downtime.id);
    return {downtime, success: true};
  }
}
