import {Flags} from '@oclif/core';
import {Command, T, util} from '../../base-command/index.js';

export type WorkflowResponse = {
  success: boolean;
  workflow: T.Workflow;
};

export default class Edit extends Command<WorkflowResponse> {
  static description = 'Edit a workflow.';
  protected permitKeyAuth = true;

  static examples = [
    '<%= config.bin %> <%= command.id %> --workflow-id=ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA',
  ];

  static flags = {
    'workflow-id': Flags.string({
      description: 'Workflow to edit.',
      required: true,
    }),
    name: Flags.string({description: 'Name for workflow.'}),
    description: Flags.string({description: 'Description for this workflow.'}),
    retry: Flags.boolean({
      description: 'Should retry be enabled?',
      default: true,
      allowNo: true,
    }),
    'retry-method': Flags.string({
      description: 'Algorithm for retries.',
      options: ['fibonacci', 'exponential', 'constant', 'never'],
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
    location: Flags.string({description: 'Only run calls from this location.'}),
    'no-location': Flags.boolean({description: 'Do not limit calls to a single location.'}),
    'show-as-action': Flags.boolean({
      description: 'Show on project home page as action.',
      default: false,
    }),
    'no-show-as-action': Flags.boolean({
      description: "Don't show on project home page as action.",
      default: false,
    }),
    parallel: Flags.boolean({description: 'Allow parallel execution.'}),
    'no-parallel': Flags.boolean({description: 'Disable parallel execution.'}),
    'add-tag': Flags.string({description: 'Tag to add to workflow.', multiple: true}),
    'remove-tag': Flags.string({description: 'Tag to remove from workflow.', multiple: true}),
    'add-call': Flags.string({
      description:
        'ID and index of call to add in a comma seperated format. To add to end, use index -1. E.g --add-call=abc123,0 to add call abc123 to start.',
      multiple: true,
    }),
    'remove-call': Flags.integer({description: 'Index of call to remove.', multiple: true}),
    'stop-on-failure': Flags.boolean({description: 'Stop on a failed call', default: false}),
    'no-stop-on-failure': Flags.boolean({
      description: "Don't stop on a failed call.",
      default: false,
    }),
    'handle-cookies': Flags.boolean({description: 'Handle cookies', default: false}),
    'no-handle-cookies': Flags.boolean({description: "Don't handle cookies", default: false}),
  };

  public async run(): Promise<WorkflowResponse> {
    const {flags} = await this.parse(Edit);

    let workflow = await this.api.get<T.Workflow>(`workflows/${flags['workflow-id']}/`);

    if (flags.name) {
      workflow.meta.name = flags.name;
    }

    if (flags.description) {
      workflow.meta.description = flags.description;
    }

    if (flags['handle-cookies'] || flags['no-handle-cookies']) {
      // eslint-disable-next-line camelcase
      workflow.workflow.handle_cookies = flags['handle-cookies'] && !flags['no-handle-cookies'];
    }

    if (flags['stop-on-failure'] || flags['no-stop-on-failure']) {
      // eslint-disable-next-line camelcase
      workflow.workflow.stop_on_failure = flags['stop-on-failure'] && !flags['no-stop-on-failure'];
    }

    // Handle all our tag based values
    const addTags: string[] = [...(flags['add-tag'] || [])];
    const removeTags: string[] = [...(flags['remove-tag'] || [])];

    if (flags['show-as-action']) {
      addTags.push('apimetrics:project_action');
    } else if (flags['no-show-as-action']) {
      removeTags.push('apimetrics:project_action');
    }

    if (flags.parallel) {
      removeTags.push('apimetrics:workflow_mutex');
    } else if (flags['no-parallel']) {
      addTags.push('apimetrics:workflow_mutex');
    }

    if (flags.location) {
      const {locations} = await this.api.get<T.Info>('agents/info');
      if (Object.keys(locations).includes(flags.location)) {
        const tagToRemove = workflow.meta.tags.find((tag) =>
          tag.match(/^apimetrics:location_id:.+$/gm)
        );
        if (tagToRemove !== `apimetrics:location_id:${flags.location}`) {
          addTags.push(`apimetrics:location_id:${flags.location}`);
          if (tagToRemove) {
            removeTags.push(tagToRemove);
          }
        }
      } else {
        throw new Error(
          `Invalid location ${flags.location}. Run 'apimetrics info locations' to see valid locations.`
        );
      }
    } else if (flags['no-location']) {
      const tagToRemove = workflow.meta.tags.find((tag) =>
        tag.match(/^apimetrics:location_id:.+$/gm)
      );
      if (tagToRemove) {
        removeTags.push(tagToRemove);
      }
    }

    if (flags.retry) {
      switch (flags['retry-method']) {
        case 'fibonacci':
          addTags.push('apimetrics:backoff:fibo');
          removeTags.push(
            'apimetrics:backoff:expo',
            'apimetrics:backoff:constant',
            'apimetrics:backoff:none'
          );
          break;
        case 'exponential':
          addTags.push('apimetrics:backoff:expo');
          removeTags.push(
            'apimetrics:backoff:fibo',
            'apimetrics:backoff:constant',
            'apimetrics:backoff:none'
          );
          break;
        case 'constant':
          addTags.push('apimetrics:backoff:constant');
          removeTags.push(
            'apimetrics:backoff:fibo',
            'apimetrics:backoff:expo',
            'apimetrics:backoff:none'
          );
          break;
        case 'never':
          addTags.push('apimetrics:backoff:none');
          removeTags.push(
            'apimetrics:backoff:fibo',
            'apimetrics:backoff:expo',
            'apimetrics:backoff:constant'
          );
      }
    } else {
      removeTags.push(
        'apimetrics:backoff:fibo',
        'apimetrics:backoff:expo',
        'apimetrics:backoff:constant',
        'apimetrics:backoff:none'
      );
    }

    if (flags['retry-base']) {
      const tagToRemove = workflow.meta.tags.find((tag) =>
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
      const tagToRemove = workflow.meta.tags.find((tag) =>
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
      const tagToRemove = workflow.meta.tags.find((tag) =>
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
      const tagToRemove = workflow.meta.tags.find((tag) =>
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
      const tagToRemove = workflow.meta.tags.find((tag) =>
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
      const tagToRemove = workflow.meta.tags.find((tag) =>
        tag.match(/^apimetrics:backoff_skip_notifs:\d+$/gm)
      );

      if (tagToRemove !== `apimetrics:backoff_skip_notifs:${flags['skip-notifications']}`) {
        addTags.push(`apimetrics:backoff_skip_notifs:${flags['skip-notifications']}`);

        if (tagToRemove) {
          removeTags.push(tagToRemove);
        }
      }
    }

    workflow.meta.tags = util.addRemoveStrings(workflow.meta.tags, addTags, removeTags);

    // Edit our call list
    const calls = workflow.workflow.call_ids as (string | undefined)[];
    if (flags['remove-call']) {
      for (const i of flags['remove-call']) {
        if (i < 0 || i > calls.length - 1) {
          if (calls.length === 0) {
            throw new Error('There are no calls to remove.');
          }

          throw new Error(
            `Call index ${i} is out of range. Index must be between 0 and ${calls.length - 1}.`
          );
        }

        // We preserve the indexing this way and will filter out later.
        calls[i] = undefined;
      }
    }

    if (flags['add-call']) {
      // Split up into ID and index + convert index to number
      const callToAdd: [string, number][] = flags['add-call'].map((val) => {
        const [id, i] = util.splitAtLastOccurrence(val, ',');
        const iNum = Number(i);
        if (Number.isNaN(iNum) || !Number.isInteger(iNum)) {
          throw new Error(`Index ${i} is not an integer.`);
        }

        return [id, iNum];
      });

      // Sort largest to smallest so when we add largest indexes, we
      // don't mess up the indexing
      callToAdd.sort((a, b) => b[1] - a[1]);

      for (const [id, i] of callToAdd) {
        if ((i < -1 || i > calls.length - 1) && !(calls.length === 0 && i === 0)) {
          throw new Error(
            `Call index ${i} is out of range. Index must be between -1 and ${calls.length - 1}.`
          );
        }

        if (i >= 0) {
          calls.splice(i, 0, id);
        } else {
          calls.push(id);
        }
      }
    }

    // Now just get rid of any left over undefined values
    // eslint-disable-next-line camelcase
    workflow.workflow.call_ids = calls.filter(Boolean) as string[];

    // Prevent 400 responses
    workflow.id = undefined;
    workflow.meta.owner = undefined;
    // eslint-disable-next-line camelcase
    workflow.meta.last_update = undefined;
    workflow.meta.created = undefined;
    workflow.meta.deployments = undefined;

    workflow = await this.api.post<T.Workflow>(`workflows/${flags['workflow-id']}/`, {
      body: workflow,
    });
    return {success: true, workflow: workflow};
  }
}
