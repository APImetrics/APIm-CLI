import {Flags} from '@oclif/core';
import {HTTPError} from 'http-call';
import * as inquirer from 'inquirer';

import {Command, T} from '../../../base-command';

export type SetProjectJson = {
  message: string;
  success: boolean;
};

export default class Set extends Command<SetProjectJson> {
  static description = 'Set the current working project';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    'project-id': Flags.string({
      char: 'p',
      description: 'ID of project to switch to',
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

      return {message: 'Set current project', success: true};
    }

    if (flags.json) {
      throw new Error(
        'Cannot use --json with interactive mode. Specify project using --project-id instead.'
      );
    }

    if (this.userConfig.organization.current === undefined) {
      throw new Error('Please select an organization first');
    }

    const availableProjects = await this.api.get<T.UserProjects>('account/projects');
    const projects: {name: string; value: string}[] = [];
    for (const project of availableProjects.projects) {
      if (project.project.org_id === this.userConfig.organization.current) {
        projects.push({
          name: `${project.project.name} (${project.project.id})`,
          value: project.project.id,
        });
      }
    }

    if (projects.length === 0) {
      this.warn('No projects accessible in organization. Please create a project first.');
      return {
        message: 'No projects accessible in organization. Please create a project first.',
        success: false,
      };
    }

    const response = await inquirer.prompt([
      {
        choices: projects,
        message: 'Select a project',
        name: 'project',
        type: 'list',
      },
    ]);

    this.userConfig.project.current = response.project;
    await this.userConfig.save();

    return {message: 'Set current project', success: true};
  }
}
