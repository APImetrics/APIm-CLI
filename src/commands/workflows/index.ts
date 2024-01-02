import {Flags, ux} from '@oclif/core';

import {Command, T} from '../../base-command';

export type WorkflowsList = {
  success: boolean;
  workflows: T.Workflow[];
};

export default class Workflows extends Command<WorkflowsList> {
  static description = 'List all workflows in the Project.';
  static examples = [
    `<%= config.bin %> <%= command.id %>
Name      Description Stop on failure Handle cookies
───────── ─────────── ─────────────── ──────────────
Buy Fruit             false           false
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

  public async run(): Promise<WorkflowsList> {
    const {flags} = await this.parse(Workflows);
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const workflows = await this.api.list<T.Workflow>('workflows/');

    ux.table(
      workflows,
      {
        created: {
          extended: true,
          get: (row) => row.meta.created,
        },
        description: {
          get: (row) => row.meta.description || '',
        },
        handleCookies: {
          get: (row) => row.workflow.handle_cookies,
          header: 'Handle cookies',
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
        name: {
          get: (row) => row.meta.name,
        },
        stopOnFailure: {
          get: (row) => row.workflow.stop_on_failure,
          header: 'Stop on failure',
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
    return {success: true, workflows};
  }
}
