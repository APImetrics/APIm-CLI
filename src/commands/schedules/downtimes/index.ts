import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type DowntimeList = {
  success: boolean;
  downtimes: T.Downtime[];
};

export default class Schedules extends Command<DowntimeList> {
  static description = 'List downtimes.';
  protected permitKeyAuth = true;

  static examples = [
    `<%= config.bin %> <%= command.id %>
ID           Schedule ID  Start                       End                         Repeat
──────────── ──────────── ─────────────────────────── ─────────────────────────── ──────
ag9zfmFwaW1… ag9zfmFwaW1… 2023-09-29T14:54:41.865000Z 2023-09-30T14:54:41.865000Z never
ag9zfmFwaW1… ag9zfmFwaW1… 2023-09-29T14:57:39.134000Z 2023-10-20T14:57:39.134000Z daily
`,
  ];

  static flags = {
    ...ux.table.flags(),
    'project-id': Flags.string({
      description: 'ID of project to read. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<DowntimeList> {
    const {flags} = await this.parse(Schedules);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const schedules = await this.api.list<T.Schedule>('schedules/');

    const downtimeRequests: Promise<T.Downtime[]>[] = [];

    for (const schedule of schedules) {
      downtimeRequests.push(this.api.list<T.Downtime>(`schedules/${schedule.id}/downtime/`));
    }

    // Flatten array of arrays. Each schedule has own array of downtimes
    const downtimes = (await Promise.all(downtimeRequests)).flat(1);

    ux.table(
      downtimes,
      {
        id: {
          header: 'ID',
          get: (row) => row.id,
        },
        scheduleId: {
          header: 'Schedule ID',
          get: (row) => row.meta.schedule_id,
        },
        start: {
          get: (row) => row.schedule.start_time,
        },
        end: {
          get: (row) => row.schedule.end_time,
        },
        repeat: {
          get: (row) => {
            switch (row.schedule.repeat_days) {
              case 0:
                return 'never';
              case 1:
                return 'daily';
              case 7:
                return 'weekly';
              default:
                return `Every ${row.schedule.repeat_days} days`;
            }
          },
        },
        lastUpdated: {
          header: 'Last Updated',
          get: (row) => row.meta.last_update,
          extended: true,
        },
        created: {
          get: (row) => row.meta.created,
          extended: true,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, downtimes: downtimes};
  }
}
