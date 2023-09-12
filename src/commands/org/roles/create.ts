import {Flags} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type RoleResponse = {
  success: boolean;
  role: T.Role;
};

export default class Create extends Command<RoleResponse> {
  static description = 'Create a role in the organization.';

  static examples = [
    `<%= config.bin %> <%= command.id %> --name TEAM_A --description "Development team A"
TEAM_A`,
  ];

  static flags = {
    name: Flags.string({description: 'Name of role.', required: true, char: 'n'}),
    description: Flags.string({description: 'Role description.', required: true, char: 'd'}),
    'org-id': Flags.string({
      description: 'ID of organization to modify. Overrides apimetrics config org set.',
      char: 'o',
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

    flags.name = flags.name.toUpperCase().replace(/ /gm, '_');

    const endpoint = `organizations/${orgId}/roles/`;
    const data = {
      id: flags.name,
      description: flags.description,
    };
    const role = await this.api.post<T.Role>(endpoint, {body: JSON.stringify(data)}, false);
    this.log(role.id);
    return {success: true, role: role};
  }
}
