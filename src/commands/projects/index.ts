import {Flags, ux} from '@oclif/core';

import {Command, T} from '../../base-command';

export type ProjectList = {
  projects: T.UserProjects['projects'];
  success: boolean;
};

export default class Projects extends Command<ProjectList> {
  static description = 'List all projects in an organisation that the current user has access to.';

  static examples = [
    `<%= config.bin %> <%= command.id %>
 Name       Tags Created
 ────────── ──── ───────────────────────────
 My Project None 2023-07-21T14:11:07.321416Z `,
  ];

  static flags = {
    ...ux.table.flags(),
    'org-id': Flags.string({
      char: 'o',
      description: 'ID of organization to modify. Overrides apimetrics config org set.',
    }),
  };

  public async run(): Promise<ProjectList> {
    const {flags} = await this.parse(Projects);

    const orgId = flags['org-id'] ?? this.userConfig.organization.current;
    if (orgId === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (orgId === '') {
      throw new Error(
        'Personal projects not currently supported. Please use web interface instead.'
      );
    }

    const endpoint = `account/projects`;
    const rawProjects = await this.api.get<T.UserProjects>(endpoint);

    const projects = rawProjects.projects.filter((val) => val.project.org_id === orgId);

    ux.table(
      projects,
      {
        created: {
          get: (row) => row.project.created,
        },
        id: {
          extended: true,
          get: (row) => row.project.id,
          header: 'ID',
        },
        name: {
          get: (row) => row.project.name,
        },
        systemTags: {
          extended: true,
          get: (row) => row.project.system_tags.join(', ') || 'None',
          header: 'System Tags',
        },
        tags: {
          get: (row) => row.project.tags.join(', ') || 'None',
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {projects, success: true};
  }
}
