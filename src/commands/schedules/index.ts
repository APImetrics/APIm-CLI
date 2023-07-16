import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../base-command';

export type ScheduleList = {
  success: boolean;
  schedules: T.Schedule[];
};

export default class Schedules extends Command<ScheduleList> {
  static description = 'List all schedules';
  protected permitKeyAuth = true;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    ...ux.table.flags(),
    'project-id': Flags.string({
      description: 'ID of project to modify. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<ScheduleList> {
    const {flags} = await this.parse(Schedules);
    const endpoint = `schedules/`;
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const {results: schedules} = await this.api.get<T.ListResponse<T.Schedule>>(
      endpoint,
      undefined,
      false
    );

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

            return `Every ${intervalMins} minutes`;
          },
        },
        regions: {
          get: (row) => row.schedule.regions.join(', '),
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
