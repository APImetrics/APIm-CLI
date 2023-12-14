import {Flags} from '@oclif/core';
import {Command} from '../../../base-command';
import * as inquirer from 'inquirer';
import {HTTPError} from 'http-call';

export type SetProjectJson = {
  success: boolean;
  message: string;
};

export default class Set extends Command<SetProjectJson> {
  static description = 'Set the current working project';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    'project-id': Flags.string({
      description:
        'ID of project to switch to. Can be found in the Project Settings' +
        ' web page under Admin Settings. Alternatively, you may omit this flag and' +
        ' select your project interactively.',
      char: 'p',
    }),
  };

  public async run(): Promise<SetProjectJson> {
    const {flags} = await this.parse(Set);
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
      try {
        await this.api.get(`project/`);
      } catch (error) {
        // Log original error to debug
        this.debug('GET project/ resulted in error: %O', error);
        if (error instanceof HTTPError && (error.statusCode === 401 || error.statusCode === 403)) {
          throw new Error(`Invalid project ID (${flags['project-id']}).`);
        }

        throw error;
      }

      this.userConfig.project.current = flags['project-id'];
      await this.userConfig.save();

      return {success: true, message: 'Set current project'};
    }

    if (flags.json) {
      throw new Error(
        'Cannot use --json with interactive mode. Specify project using --project-id instead.'
      );
    }

    if (this.userConfig.organization.current === undefined) {
      throw new Error('Please select an organization first');
    }

    const availableProjects = await this.api.get<any>('account/projects');
    const projects: {name: string; value: string}[] = [];
    for (const key of Object.keys(availableProjects.projects)) {
      if (availableProjects.projects[key].project.org_id === this.userConfig.organization.current) {
        projects.push({
          name: `${availableProjects.projects[key].project.name} (${availableProjects.projects[key].project.id})`,
          value: availableProjects.projects[key].project.id,
        });
      }
    }

    if (projects.length === 0) {
      this.warn('No projects accessible in organization. Please create a project first.');
      return {
        success: false,
        message: 'No projects accessible in organization. Please create a project first.',
      };
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
    await this.userConfig.save();

    return {success: true, message: 'Set current project'};
  }
}
