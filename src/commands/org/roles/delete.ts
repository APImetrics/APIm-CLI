import {Flags} from '@oclif/core';
import {Command, T} from '../../../base-command';
import * as inquirer from 'inquirer';

export type DeleteResponse = {
  success: boolean;
};

export default class Delete extends Command<DeleteResponse> {
  static description = 'Delete a role in the organization';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    role: Flags.string({description: 'Role to delete', char: 'r'}),
    'org-id': Flags.string({
      description: 'ID of organization to modify. Overrides apimetrics config org set.',
      char: 'o',
    }),
  };

  public async run(): Promise<DeleteResponse> {
    const {flags} = await this.parse(Delete);

    const orgId = flags['org-id'] ? flags['org-id'] : this.userConfig.organization.current;
    if (orgId === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (orgId === '') {
      throw new Error('Organization roles not supported for personal projects.');
    }

    let role: string;
    if (flags.role) {
      role = flags.role;
    } else if (flags.json) {
      throw new Error('No role selected for deletion.');
    } else {
      const endpoint = `organizations/${orgId}/roles/`;
      const rawRoles = await this.api.list<T.Role>(endpoint);
      const roles: string[] = [];
      for (const role of rawRoles) {
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

    const endpoint = `organizations/${orgId}/roles/${role}/`;
    await this.api.delete(endpoint);
    return {success: true};
  }
}
