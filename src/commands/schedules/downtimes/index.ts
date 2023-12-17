import {Flags, ux} from '@oclif/core';

import {Command, T} from '../../../base-command';

export type DowntimeList = {
  downtimes: T.Downtime[];
  success: boolean;
};

export default class Schedules extends Command<DowntimeList> {
  static description = 'List downtimes for all Schedules.';
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
      char: 'p',
      description:
        'ID of project to read. Overrides apimetrics config project set.' +
        ' Can be found in the Project Settings web page under the admin' +
        ' section or by using the command `apimetrics projects --columns name,id`.',
    }),
  };

  protected permitKeyAuth = true;

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

    const response = await Promise.all(downtimeRequests);
    // Flatten array of arrays. Each schedule has own array of downtimes
    const downtimes = response.flat(1);

    ux.table(
      downtimes,
      {
        created: {
          extended: true,
          get: (row) => row.meta.created,
        },
        end: {
          get: (row) => row.schedule.end_time,
        },
        id: {
          get: (row) => row.id,
          header: 'ID',
        },
        lastUpdated: {
          extended: true,
          get: (row) => row.meta.last_update,
          header: 'Last Updated',
        },
        repeat: {
          get(row) {
            switch (row.schedule.repeat_days) {
              case 0: {
                return 'never';
              }

              case 1: {
                return 'daily';
              }

              case 7: {
                return 'weekly';
              }

              default: {
                return `Every ${row.schedule.repeat_days} days`;
              }
            }
          },
        },
        scheduleId: {
          get: (row) => row.meta.schedule_id,
          header: 'Schedule ID',
        },
        start: {
          get: (row) => row.schedule.start_time,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {downtimes, success: true};
  }
}
