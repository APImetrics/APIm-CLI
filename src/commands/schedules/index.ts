import {Flags, ux} from '@oclif/core';

import {Command, T} from '../../base-command';

export type ScheduleList = {
  schedules: T.Schedule[];
  success: boolean;
};

export default class Schedules extends Command<ScheduleList> {
  static description = 'List schedules.';
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
      char: 'p',
      description:
        'ID of project to read. Overrides apimetrics config project set.' +
        ' Can be found in the Project Settings web page under the admin' +
        ' section or by using the command `apimetrics projects --columns name,id`.',
    }),
  };

  protected permitKeyAuth = true;

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
        backoff: {
          extended: true,
          get(row) {
            switch (row.schedule.backoff_method) {
              case 'fibo': {
                return 'fibonacci';
              }

              case 'expo': {
                return 'exponential';
              }

              default: {
                return row.schedule.backoff_method;
              }
            }
          },
          header: 'Backoff method',
        },
        created: {
          extended: true,
          get: (row) => row.meta.created,
        },
        frequency: {
          get(row) {
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
        id: {
          extended: true,
          header: 'ID',
        },
        lastUpdated: {
          extended: true,
          get: (row) => row.meta.last_update,
          header: 'Last Updated',
        },
        locations: {
          get: (row) => row.schedule.locations.join(', '),
        },
        name: {
          get: (row) => row.meta.name,
        },
        regions: {
          get: (row) => row.schedule.regions.join(', '),
        },
        tags: {
          extended: true,
          get: (row) => row.meta.tags.join(', '),
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {schedules, success: true};
  }
}
