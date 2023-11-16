import {Flags} from '@oclif/core';
import {Command, T, util} from '../../base-command';

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
    }),
    name: Flags.string({
      description: 'Name of schedule.',
    }),
    'retry-method': Flags.string({
      description: 'Algorithm for retries.',
      options: ['fibonacci', 'exponential', 'constant'],
    }),
    retry: Flags.boolean({
      description: 'Should retry be enabled?',
      default: true,
      allowNo: true,
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
    'no-postman': Flags.boolean({
      description: 'Disable the Postman Monitoring feature',
    }),
    'add-location': Flags.string({
      description: 'Add location to run calls from.',
      multiple: true,
    }),
    'remove-location': Flags.string({
      description: 'Remove location to run calls from.',
      multiple: true,
    }),
    'add-region': Flags.string({
      description: 'Add region to run calls from.',
      multiple: true,
    }),
    'remove-region': Flags.string({
      description: 'Remove region to run calls from.',
      multiple: true,
    }),
    'schedule-id': Flags.string({description: 'Schedule to delete.', required: true}),
  };

  public async run(): Promise<Schedule> {
    const {flags} = await this.parse(Create);

    let schedule = await this.api.get<T.Schedule>(`schedules/${flags['schedule-id']}/`);

    if (flags.interval) {
      const multiplier = flags.interval.endsWith('m') ? 60 : 60 * 60; // Minutes : hours to seconds
      const frequency =
        Number(flags.interval.slice(0, Math.max(0, flags.interval.length - 1))) * multiplier;
      schedule.schedule.frequency = frequency;
    }

    if (flags.name) {
      schedule.meta.name = flags.name;
    }

    const addTags: string[] = [];
    const removeTags: string[] = [];

    if (flags.postman) {
      addTags.push('apimetrics:postman');
    }

    if (flags['no-postman']) {
      removeTags.push('apimetrics:postman');
    }

    if (flags.retry) {
      switch (flags['retry-method']) {
        case 'fibonacci':
          addTags.push('apimetrics:backoff:fibo');
          removeTags.push('apimetrics:backoff:expo', 'apimetrics:backoff:constant');
          break;
        case 'exponential':
          addTags.push('apimetrics:backoff:expo');
          removeTags.push('apimetrics:backoff:fibo', 'apimetrics:backoff:constant');
          break;
        case 'constant':
          addTags.push('apimetrics:backoff:constant');
          removeTags.push('apimetrics:backoff:fibo', 'apimetrics:backoff:expo');
          break;
      }
    } else {
      removeTags.push(
        'apimetrics:backoff:fibo',
        'apimetrics:backoff:expo',
        'apimetrics:backoff:constant'
      );
    }

    if (flags['retry-base']) {
      const tagToRemove = schedule.meta.tags.find((tag) =>
        tag.match(/^apimetrics:backoff_base:\d+$/gm)
      );

      if (tagToRemove !== `apimetrics:backoff_base:${flags['retry-base']}`) {
        addTags.push(`apimetrics:backoff_base:${flags['retry-base']}`);

        if (tagToRemove) {
          removeTags.push(tagToRemove);
        }
      }
    }

    if (flags['retry-factor']) {
      const tagToRemove = schedule.meta.tags.find((tag) =>
        tag.match(/^apimetrics:backoff_factor:\d+$/gm)
      );

      if (tagToRemove !== `apimetrics:backoff_factor:${flags['retry-factor']}`) {
        addTags.push(`apimetrics:backoff_factor:${flags['retry-factor']}`);

        if (tagToRemove) {
          removeTags.push(tagToRemove);
        }
      }
    }

    if (flags['retry-interval']) {
      const tagToRemove = schedule.meta.tags.find((tag) =>
        tag.match(/^apimetrics:backoff_interval:\d+$/gm)
      );

      if (tagToRemove !== `apimetrics:backoff_interval:${flags['retry-interval']}`) {
        addTags.push(`apimetrics:backoff_interval:${flags['retry-interval']}`);

        if (tagToRemove) {
          removeTags.push(tagToRemove);
        }
      }
    }

    if (flags['max-retries']) {
      const tagToRemove = schedule.meta.tags.find((tag) =>
        tag.match(/^apimetrics:backoff_max_retries:\d+$/gm)
      );

      if (tagToRemove !== `apimetrics:backoff_max_retries:${flags['max-retries']}`) {
        addTags.push(`apimetrics:backoff_max_retries:${flags['max-retries']}`);

        if (tagToRemove) {
          removeTags.push(tagToRemove);
        }
      }
    }

    if (flags['ignore-in-stats']) {
      const tagToRemove = schedule.meta.tags.find((tag) =>
        tag.match(/^apimetrics:backoff_skip_save:\d+$/gm)
      );

      if (tagToRemove !== `apimetrics:backoff_skip_save:${flags['ignore-in-stats']}`) {
        addTags.push(`apimetrics:backoff_skip_save:${flags['ignore-in-stats']}`);

        if (tagToRemove) {
          removeTags.push(tagToRemove);
        }
      }
    }

    if (flags['skip-notifications']) {
      const tagToRemove = schedule.meta.tags.find((tag) =>
        tag.match(/^apimetrics:backoff_skip_notifs:\d+$/gm)
      );

      if (tagToRemove !== `apimetrics:backoff_skip_notifs:${flags['skip-notifications']}`) {
        addTags.push(`apimetrics:backoff_skip_notifs:${flags['skip-notifications']}`);

        if (tagToRemove) {
          removeTags.push(tagToRemove);
        }
      }
    }

    if (
      flags['add-region'] ||
      flags['add-location'] ||
      flags['remove-region'] ||
      flags['remove-location']
    ) {
      const {locations, regions} = await this.api.get<T.Info>('agents/info');

      if (flags['add-location']) {
        for (const location of flags['add-location']) {
          if (!Object.keys(locations).includes(location)) {
            throw new Error(
              `Invalid location ${location}. Run 'apimetrics info locations' to see valid locations.`
            );
          }
        }
      }

      if (flags['add-region']) {
        for (const region of flags['add-region']) {
          if (!regions.some((val) => val.id === region)) {
            throw new Error(
              `Invalid region ${region}. Run 'apimetrics info regions' to see valid region IDs.`
            );
          }
        }
      }

      schedule.schedule.regions = util.addRemoveStrings(
        schedule.schedule.regions,
        flags['add-region'] || [],
        flags['remove-region'] || []
      );
      schedule.schedule.locations = util.addRemoveStrings(
        schedule.schedule.locations,
        flags['add-location'] || [],
        flags['remove-location'] || []
      );
    }

    schedule.meta.tags = util.addRemoveStrings(schedule.meta.tags, addTags, removeTags);

    schedule.id = undefined;
    schedule.meta.owner = undefined;
    // eslint-disable-next-line camelcase
    schedule.meta.last_update = undefined;
    schedule.meta.created = undefined;

    schedule = await this.api.post<T.Schedule>(`schedules/${flags['schedule-id']}/`, {
      body: schedule,
    });
    return {success: true, schedule: schedule};
  }
}
