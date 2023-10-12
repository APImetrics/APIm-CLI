import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../base-command';

export type ScheduleList = {
  success: boolean;
  schedules: T.Schedule[];
};

export default class Schedules extends Command<ScheduleList> {
  static description = 'List schedules.';
  protected permitKeyAuth = true;

  static examples = [
    `<%= config.bin %> <%= command.id %>
Name          Frequency        Regions
───────────── ──────────────── ───────
High freq     Every 10 seconds all
Schedule 2    Every 5 minutes  all, oc
`,
  ];

  static flags = {
    ...ux.table.flags(),
    'project-id': Flags.string({
      description: 'ID of project to read. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<ScheduleList> {
    const {flags} = await this.parse(Schedules);
    const endpoint = `schedules/`;
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const schedules = await this.api.list<T.Schedule>(endpoint);

    ux.table(
      schedules,
      {
        name: {
          get: (row) => row.meta.name,
        },
        frequency: {
          get: (row) => {
            const intervalMins = row.schedule.frequency / 60;
            if (intervalMins >= 60) {
              return `Every ${intervalMins / 60} hours`;
            }

            if (intervalMins >= 1) {
              return `Every ${intervalMins} minutes`;
            }

            return `Every ${intervalMins * 60} seconds`;
          },
        },
        regions: {
          get: (row) => row.schedule.regions.join(', '),
        },
        locations: {
          get: (row) => row.schedule.locations.join(', '),
        },
        id: {
          header: 'ID',
          extended: true,
        },
        tags: {
          get: (row) => row.meta.tags.join(', '),
          extended: true,
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
        backoff: {
          header: 'Backoff method',
          get: (row) => {
            switch (row.schedule.backoff_method) {
              case 'fibo':
                return 'fibonacci';
              case 'expo':
                return 'exponential';
              default:
                return row.schedule.backoff_method;
            }
          },
          extended: true,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, schedules: schedules};
  }
}
