import {Flags} from '@oclif/core';

import {Command, T} from '../../base-command';

export type WorkflowResponse = {
  success: boolean;
  workflow: T.Workflow;
};

export default class Create extends Command<WorkflowResponse> {
  static description = 'Create a new workflow.';
  static examples = ['<%= config.bin %> <%= command.id %> --name="My Workflow"'];

  static flags = {
    call: Flags.string({
      description: 'ID of call to add to workflow.',
      multiple: true,
    }),
    description: Flags.string({description: 'Description for this workflow.'}),
    'handle-cookies': Flags.boolean({
      allowNo: true,
      default: false,
      description: 'Should cookies be handled?',
    }),
    'ignore-in-stats': Flags.integer({
      description: 'Number of retries to ignore in failure statistics.',
      min: 1,
    }),
    location: Flags.string({description: 'Only run calls from this location.'}),
    'max-retries': Flags.integer({
      description: 'Maximum number of retries to attempt.',
      min: 1,
    }),
    name: Flags.string({
      description: 'Name for workflow.',
      required: true,
    }),
    parallel: Flags.boolean({
      allowNo: true,
      default: true,
      description: 'Should parallel execution be allowed?',
    }),
    'project-id': Flags.string({
      char: 'p',
      description: 'ID of project to modify. Overrides apimetrics config project set.',
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
    'retry-method': Flags.string({
      description: 'Algorithm for retries.',
      options: ['fibonacci', 'exponential', 'constant', 'never'],
    }),
    'show-as-action': Flags.boolean({description: 'Show on project home page as action.'}),
    'skip-notifications': Flags.integer({
      description: 'Number of retries to attempt before sending notifications.',
      min: 1,
    }),
    'stop-on-failure': Flags.boolean({
      allowNo: true,
      default: true,
      description: 'Should the workflow stop execution on a failed call?',
    }),
    tag: Flags.string({description: 'Tag to add to workflow.', multiple: true}),
  };

  protected permitKeyAuth = true;

  public async run(): Promise<WorkflowResponse> {
    const {flags} = await this.parse(Create);
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const body = {
      meta: {
        description: flags.description,
        name: flags.name,
        tags: [...(flags.tag || [])] as string[],
      },
      workflow: {
        // eslint-disable-next-line camelcase
        call_ids: flags.call,
        // eslint-disable-next-line camelcase
        handle_cookies: flags['handle-cookies'],
        // eslint-disable-next-line camelcase
        stop_on_failure: flags['stop-on-failure'],
      },
    };

    if (flags['show-as-action']) {
      body.meta.tags.push('apimetrics:project_action');
    }

    if (!flags.parallel) {
      body.meta.tags.push('apimetrics:workflow_mutex');
    }

    if (flags.location) {
      const {locations} = await this.api.get<T.Info>('agents/info');
      if (Object.keys(locations).includes(flags.location)) {
        body.meta.tags.push(`apimetrics:location_id:${flags.location}`);
      } else {
        throw new Error(
          `Invalid location ${flags.location}. Run 'apimetrics info locations' to see valid locations.`
        );
      }
    }

    // Handle retry flags
    switch (flags['retry-method']) {
      case 'fibonacci': {
        body.meta.tags.push('apimetrics:backoff:fibo');
        break;
      }

      case 'exponential': {
        body.meta.tags.push('apimetrics:backoff:expo');
        if (flags['retry-base']) {
          body.meta.tags.push(`apimetrics:backoff_base:${flags['retry-base']}`);
        }

        if (flags['retry-factor']) {
          body.meta.tags.push(`apimetrics:backoff_factor:${flags['retry-factor']}`);
        }

        break;
      }

      case 'constant': {
        body.meta.tags.push('apimetrics:backoff:constant');
        if (flags['retry-interval']) {
          body.meta.tags.push(`apimetrics:backoff_interval:${flags['retry-interval']}`);
        }

        break;
      }

      case 'never': {
        body.meta.tags.push('apimetrics:backoff:none');
        break;
      }
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

    const workflow = await this.api.post<T.Workflow>(`workflows/`, {body});
    this.log(workflow.id);
    return {success: true, workflow};
  }
}
