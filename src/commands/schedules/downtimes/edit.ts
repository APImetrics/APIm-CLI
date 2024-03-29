import {Flags} from '@oclif/core';

import {Command, T} from '../../../base-command';

export type Downtime = {
  downtime: T.Downtime;
  success: boolean;
};

export default class Create extends Command<Downtime> {
  static description = 'Edit downtime.';
  static examples = [
    `
<%= config.bin %> <%= command.id %> --downtime-id pPbCtcWNyMwsSDU --start 2023-07-21T18:32:00Z --end 2023-07-21T19:32:00Z`,
  ];

  static flags = {
    'downtime-id': Flags.string({
      description:
        'Downtime to edit. Can be found using the command' +
        '`apimetrics schedules downtimes --columns id',
      required: true,
    }),
    end: Flags.string({
      description: 'Date and time to end downtime in Date Time format (YYYY-MM-DDTHH:mm:ss.sssZ).',
    }),
    repeat: Flags.string({
      description: 'Repeat this downtime at the set interval.',
      options: ['daily', 'weekly', 'off'],
    }),
    start: Flags.string({
      description:
        'Date and time to start downtime in Date Time format (YYYY-MM-DDTHH:mm:ss.sssZ).',
    }),
  };

  protected permitKeyAuth = true;

  public async run(): Promise<Downtime> {
    const {flags} = await this.parse(Create);

    const {schedule: downtime} = await this.api.get<T.Downtime>(
      `schedules/downtime/${flags['downtime-id']}/`
    );

    let repeat = 0;
    if (flags.repeat) {
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
    } else {
      repeat = downtime.repeat_days;
    }

    let start: Date;
    if (flags.start) {
      start = new Date(flags.start);
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
    } else {
      start = new Date(downtime.start_time);
    }

    let end: Date;
    if (flags.end) {
      end = new Date(flags.end);
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
    } else {
      end = new Date(downtime.end_time);
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
      repeated: Boolean(repeat),
      // eslint-disable-next-line camelcase
      start_time: start.toISOString(),
    };

    const updatedDowntime = await this.api.post<T.Downtime>(
      `schedules/downtime/${flags['downtime-id']}/`,
      {
        body: {downtime: body},
      }
    );
    return {downtime: updatedDowntime, success: true};
  }
}
