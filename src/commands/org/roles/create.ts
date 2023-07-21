import {Flags} from '@oclif/core';
import {Command, T} from '../../../base-command';

export type RoleResponse = {
  success: boolean;
  role: T.Role;
};

export default class Create extends Command<RoleResponse> {
  static description = 'Create a role in the organisation';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    name: Flags.string({description: 'Name of role', required: true, char: 'n'}),
    description: Flags.string({description: 'Role description', required: true, char: 'd'}),
  };

  public async run(): Promise<RoleResponse> {
    const {flags} = await this.parse(Create);

    if (this.userConfig.organisation.current === undefined) {
      throw new Error('Current organisation not set. Run `apimetrics config org set` first.');
    } else if (this.userConfig.organisation.current === '') {
      throw new Error('Organisation roles not supported for personal projects');
    }

    flags.name = flags.name.toUpperCase().replace(/ /gm, '_');

    const endpoint = `organizations/${this.userConfig.organisation.current}/roles/`;
    const data = {
      id: flags.name,
      description: flags.description,
    };
    const role = await this.api.post<T.Role>(endpoint, {body: JSON.stringify(data)}, false);
    this.log(role.id);
    return {success: true, role: role};
  }
}
