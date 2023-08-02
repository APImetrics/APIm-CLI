import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../base-command';

export type ProjectList = {
  success: boolean;
  projects: T.UserProjects['projects'];
};

export default class Projects extends Command<ProjectList> {
  static description = 'List all projects in an organisation that the current user has access to.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    ...ux.table.flags(),
    'org-id': Flags.string({
      description: 'ID of organization to modify. Overrides apimetrics config org set.',
      char: 'o',
    }),
  };

  public async run(): Promise<ProjectList> {
    const {flags} = await this.parse(Projects);

    const orgId = flags['org-id'] ? flags['org-id'] : this.userConfig.organization.current;
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
        name: {
          get: (row) => row.project.name,
        },
        tags: {
          get: (row) => row.project.tags.join(', ') || 'None',
        },
        created: {
          get: (row) => row.created,
        },
        systemTags: {
          header: 'System Tags',
          get: (row) => row.project.system_tags.join(', ') || 'None',
          extended: true,
        },
        id: {
          header: 'ID',
          get: (row) => row.id,
          extended: true,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, projects: projects};
  }
}
