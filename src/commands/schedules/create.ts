import {Flags} from '@oclif/core';
import {Command, T} from '../../base-command';

export type Schedule = {
  success: boolean;
  schedule: T.Schedule;
};

export default class Create extends Command<Schedule> {
  static description = 'Create schedule.';
  protected permitKeyAuth = true;

  static examples = [
    `
<%= config.bin %> <%= command.id %> --name "My Schedule" --interval 5m
ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA`,
  ];

  static flags = {
    interval: Flags.string({
      description: 'Schedule interval.',
      options: [
        '1m',
        '2m',
        '3m',
        '4m',
        '5m',
        '6m',
        '10m',
        '12m',
        '15m',
        '20m',
        '30m',
        '60m',
        '2h',
        '3h',
        '4h',
        '6h',
        '8h',
        '12h',
        '24h',
      ],
      required: true,
    }),
    name: Flags.string({
      description: 'Name of schedule.',
      required: true,
    }),
    'retry-method': Flags.string({
      description: 'Algorithm for retries.',
      options: ['fibonacci', 'exponential', 'constant'],
    }),
    'retry-base': Flags.integer({
      description: 'Base for exponential retry.',
      min: 1,
    }),
    'retry-factor': Flags.integer({
      description: 'Factor for exponential retry.',
      min: 1,
    }),
    'retry-interval': Flags.integer({
      description: 'Wait X seconds between each retry.',
      min: 1,
    }),
    'max-retries': Flags.integer({
      description: 'Maximum number of retries to attempt.',
      min: 1,
    }),
    'skip-notifications': Flags.integer({
      description: 'Number of retries to attempt before sending notifications.',
      min: 1,
    }),
    'ignore-in-stats': Flags.integer({
      description: 'Number of retries to ignore in failure statistics.',
      min: 1,
    }),
    postman: Flags.boolean({
      description: 'Only enable if you use the Postman Monitoring feature',
    }),
    location: Flags.string({
      description: 'Location to run calls from.',
      multiple: true,
    }),
    region: Flags.string({
      description: 'Region to run calls from.',
      multiple: true,
    }),
    'project-id': Flags.string({
      description: 'ID of project to read. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<Schedule> {
    const {flags} = await this.parse(Create);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const multiplier = flags.interval.endsWith('m') ? 60 : 60 * 60; // Minutes : hours to seconds
    const frequency =
      Number(flags.interval.slice(0, Math.max(0, flags.interval.length - 1))) * multiplier;

    const body = {
      meta: {
        name: flags.name,
        tags: [] as string[],
      },
      schedule: {
        // eslint-disable-next-line camelcase
        backoff_method: null, // Set via tags
        frequency: frequency,
        locations: [] as string[],
        regions: [] as string[],
      },
    };

    if (flags.postman) {
      body.meta.tags.push('apimetrics:postman');
    }

    switch (flags['retry-method']) {
      case 'fibonacci':
        body.meta.tags.push('apimetrics:backoff:fibo');
        break;
      case 'exponential':
        body.meta.tags.push('apimetrics:backoff:expo');
        if (flags['retry-base']) {
          body.meta.tags.push(`apimetrics:backoff_base:${flags['retry-base']}`);
        }

        if (flags['retry-factor']) {
          body.meta.tags.push(`apimetrics:backoff_factor:${flags['retry-factor']}`);
        }

        break;
      case 'constant':
        body.meta.tags.push('apimetrics:backoff:constant');
        if (flags['retry-interval']) {
          body.meta.tags.push(`apimetrics:backoff_interval:${flags['retry-interval']}`);
        }

        break;
    }

    if (flags['max-retries']) {
      body.meta.tags.push(`apimetrics:backoff_max_retries:${flags['max-retries']}`);
    }

    if (flags['ignore-in-stats']) {
      body.meta.tags.push(`apimetrics:backoff_skip_save:${flags['ignore-in-stats']}`);
    }

    if (flags['skip-notifications']) {
      body.meta.tags.push(`apimetrics:backoff_skip_notifs:${flags['skip-notifications']}`);
    }

    if (!flags.region && !flags.location) {
      body.schedule.regions = ['all'];
    } else {
      const {locations, regions} = await this.api.get<T.Info>('agents/info');
      if (flags.location) {
        for (const location of flags.location) {
          if (Object.keys(locations).includes(location)) {
            body.schedule.locations.push(location);
          } else {
            throw new Error(
              `Invalid location ${location}. Run 'apimetrics info locations' to see valid locations.`
            );
          }
        }
      }

      if (flags.region) {
        for (const region of flags.region) {
          if (regions.some((val) => val.id === region)) {
            body.schedule.regions.push(region);
          } else {
            throw new Error(
              `Invalid region ${region}. Run 'apimetrics info regions' to see valid region IDs.`
            );
          }
        }
      }
    }

    const schedule = await this.api.post<T.Schedule>('schedules/', {body: JSON.stringify(body)});
    this.log(schedule.id);
    return {success: true, schedule: schedule};
  }
}
