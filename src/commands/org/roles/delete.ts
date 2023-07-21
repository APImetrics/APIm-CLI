import {Flags} from '@oclif/core';
import {Command, T} from '../../../base-command';
import * as inquirer from 'inquirer';

export type DeleteResponse = {
  success: boolean;
};

export default class Delete extends Command<DeleteResponse> {
  static description = 'Delete a role in the organisation';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    role: Flags.string({description: 'Role to delete', char: 'r'}),
  };

  public async run(): Promise<DeleteResponse> {
    const {flags} = await this.parse(Delete);

    if (this.userConfig.organisation.current === undefined) {
      throw new Error('Current organisation not set. Run `apimetrics config org set` first.');
    } else if (this.userConfig.organisation.current === '') {
      throw new Error('Organisation roles not supported for personal projects.');
    }

    let role: string;
    if (flags.role) {
      role = flags.role;
    } else if (flags.json) {
      throw new Error('No role selected for deletion.');
    } else {
      const endpoint = `organizations/${this.userConfig.organisation.current}/roles/`;
      const rawRoles = await this.api.get<T.ListResponse<T.Role>>(endpoint);
      const roles: string[] = [];
      for (const role of rawRoles.results) {
        roles.push(role.id);
      }

      const response = await inquirer.prompt([
        {
          name: 'role',
          message: 'Select role to delete',
          type: 'list',
          choices: roles,
        },
      ]);
      role = response.role;
    }

    const endpoint = `organizations/${this.userConfig.organisation.current}/roles/${role}/`;
    await this.api.delete(endpoint);
    return {success: true};
  }
}
