import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../base-command';

export type WorkflowsList = {
  success: boolean;
  workflows: T.Workflow[];
};

export default class Workflows extends Command<WorkflowsList> {
  static description = 'List all workflows';
  protected permitKeyAuth = true;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    ...ux.table.flags(),
    'project-id': Flags.string({
      description: 'ID of project to modify. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<WorkflowsList> {
    const {flags} = await this.parse(Workflows);
    const endpoint = `workflows/`;
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const workflows = await this.api.list<T.Workflow>(endpoint);

    ux.table(
      workflows,
      {
        name: {
          get: (row) => row.meta.name,
        },
        description: {
          get: (row) => row.meta.description,
        },
        stopOnFailure: {
          header: 'Stop on failure',
          get: (row) => row.workflow.stop_on_failure,
        },
        handleCookies: {
          header: 'Handle cookies',
          get: (row) => row.workflow.handle_cookies,
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
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, workflows: workflows};
  }
}
