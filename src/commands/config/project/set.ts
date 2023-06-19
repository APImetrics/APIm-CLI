import {Flags} from '@oclif/core';
import {Command} from '../../../base-command';
import * as inquirer from 'inquirer';

export type SetProjectJson = {
  success: boolean;
  message: string;
};

export default class Set extends Command<SetProjectJson> {
  static description = 'Set the current working project';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    'project-id': Flags.string({
      description: 'ID of project to switch to',
      char: 'i',
    }),
  };

  public async run(): Promise<SetProjectJson> {
    const {flags} = await this.parse(Set);
    if (flags['project-id']) {
      this.userConfig.project.current = flags['project-id'];
      await this.userConfig.save();

      return {success: true, message: 'Set current project'};
    }

    if (flags.json) {
      throw new Error(
        'Cannot use --json with interactive mode. Specify project using --project-id instead.'
      );
    }

    if (this.userConfig.organisation.current === undefined) {
      throw new Error('Please select an organization first');
    }

    const availableProjects = await this.api.get<any>('account/projects');
    const projects: {name: string; value: string}[] = [];
    for (const key of Object.keys(availableProjects.projects)) {
      if (availableProjects.projects[key].project.org_id === this.userConfig.organisation.current) {
        projects.push({
          name: `${availableProjects.projects[key].project.name} (${availableProjects.projects[key].project.id})`,
          value: availableProjects.projects[key].project.id,
        });
      }
    }

    const response = await inquirer.prompt([
      {
        name: 'project',
        message: 'Select a project',
        type: 'list',
        choices: projects,
      },
    ]);

    this.userConfig.project.current = response.project;
    this.userConfig.save();

    return {success: true, message: 'Set current project'};
  }
}
