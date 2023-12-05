import {Flags} from '@oclif/core';

import {Command, T} from '../../../base-command';

export type RoleResponse = {
  role: T.Role;
  success: boolean;
};

export default class Create extends Command<RoleResponse> {
  static description = 'Create a role in the organization.';

  static examples = [
    `<%= config.bin %> <%= command.id %> --name TEAM_A --description "Development team A"
TEAM_A`,
  ];

  static flags = {
    description: Flags.string({char: 'd', description: 'Role description.', required: true}),
    name: Flags.string({char: 'n', description: 'Name of role.', required: true}),
    'org-id': Flags.string({
      char: 'o',
      description: 'ID of organization to modify. Overrides apimetrics config org set.',
    }),
  };

  public async run(): Promise<RoleResponse> {
    const {flags} = await this.parse(Create);

    const orgId = flags['org-id'] ? flags['org-id'] : this.userConfig.organization.current;
    if (orgId === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (orgId === '') {
      throw new Error('Organization roles not supported for personal projects.');
    }

    flags.name = flags.name.toUpperCase().replaceAll(/ /gm, '_');

    const endpoint = `organizations/${orgId}/roles/`;
    const data = {
      description: flags.description,
      id: flags.name,
    };
    const role = await this.api.post<T.Role>(endpoint, {body: data});
    this.log(role.id);
    return {role, success: true};
  }
}
