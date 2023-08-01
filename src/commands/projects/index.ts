import {ux} from '@oclif/core';
import {Command, T} from '../../base-command';

export type ProjectList = {
  success: boolean;
  projects: T.Project[];
};

export default class Projects extends Command<ProjectList> {
  static description = 'List all projects';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    ...ux.table.flags(),
  };

  public async run(): Promise<ProjectList> {
    const {flags} = await this.parse(Projects);

    if (this.userConfig.organization.current === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (this.userConfig.organization.current === '') {
      throw new Error(
        'Listing personal projects not currently supported. Please use web interface instead.'
      );
    }

    const endpoint = `organizations/${this.userConfig.organization.current}/projects/`;
    const {results: projects} = await this.api.get<T.ListResponse<T.Project>>(
      endpoint,
      undefined,
      false
    );

    ux.table(
      projects,
      {
        name: {
          get: (row) => row.name,
        },
        tags: {
          get: (row) => row.tags.join(', ') || 'None',
        },
        created: {
          get: (row) => row.created,
        },
        systemTags: {
          header: 'System Tags',
          get: (row) => row.system_tags.join(', ') || 'None',
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
