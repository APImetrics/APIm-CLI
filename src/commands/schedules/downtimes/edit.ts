import {Flags} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type Downtime = {
  success: boolean;
  downtime: T.Downtime;
};

export default class Create extends Command<Downtime> {
  static description = 'Edit downtime.';
  protected permitKeyAuth = true;

  static examples = [
    `
<%= config.bin %> <%= command.id %> --downtime-id pPbCtcWNyMwsSDU --start 2023-07-21T18:32:00Z --end 2023-07-21T19:32:00Z`,
  ];

  static flags = {
    start: Flags.string({
      description:
        'Date and time to start downtime in Date Time format (YYYY-MM-DDTHH:mm:ss.sssZ).',
    }),
    end: Flags.string({
      description: 'Date and time to end downtime in Date Time format (YYYY-MM-DDTHH:mm:ss.sssZ).',
    }),
    'downtime-id': Flags.string({
      description: 'ID of downtime to edit.',
      required: true,
    }),
    repeat: Flags.string({
      description: 'Repeat this downtime at the set interval.',
      options: ['daily', 'weekly', 'off'],
    }),
    'project-id': Flags.string({
      description: 'ID of project to read. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<Downtime> {
    const {flags} = await this.parse(Create);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const {schedule: downtime} = await this.api.get<T.Downtime>(
      `schedules/downtime/${flags['downtime-id']}/`
    );

    let repeat = 0;
    if (flags.repeat) {
      switch (flags.repeat) {
        case 'daily':
          repeat = 1;
          break;
        case 'weekly':
          repeat = 7;
          break;
      }
    } else {
      repeat = downtime.repeat_days;
    }

    let start: Date;
    if (flags.start) {
      try {
        start = new Date(flags.start);
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
      try {
        end = new Date(flags.end);
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
      start_time: start.toISOString(),
      // eslint-disable-next-line camelcase
      end_time: end.toISOString(),
      repeated: Boolean(repeat),
      // eslint-disable-next-line camelcase
      repeat_days: repeat,
    };

    const updatedDowntime = await this.api.post<T.Downtime>(
      `schedules/downtime/${flags['downtime-id']}/`,
      {
        body: JSON.stringify({downtime: body}),
      }
    );
    return {success: true, downtime: updatedDowntime};
  }
}
