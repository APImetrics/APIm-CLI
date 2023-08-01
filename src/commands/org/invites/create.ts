import {Flags} from '@oclif/core';
import {Command, T, util} from '../../../base-command';
import * as inquirer from 'inquirer';

export type InviteResponse = {
  success: boolean;
  invite: T.Invite;
};

export default class Create extends Command<InviteResponse> {
  static description = 'Create an invite to the organization';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    email: Flags.string({description: 'Email to send invite to', required: true}),
    role: Flags.string({description: 'Users role', multiple: true}),
  };

  public async run(): Promise<InviteResponse> {
    const {flags} = await this.parse(Create);

    if (this.userConfig.organization.current === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (this.userConfig.organization.current === '') {
      throw new Error('organization invites not supported for personal projects.');
    }

    if (!util.validateEmail(flags.email)) {
      throw new Error(`Invalid email: ${flags.email}`);
    }

    let endpoint = `organizations/${this.userConfig.organization.current}/roles/`;
    const rawRoles = await this.api.get<T.ListResponse<T.Role>>(endpoint);
    const roles: string[] = [];
    for (const role of rawRoles.results) {
      roles.push(role.id);
    }

    let selectedRoles: string[] = [];
    if (flags.role) {
      for (const role of flags.role) {
        if (!roles.includes(role)) {
          throw new Error(`Unrecognized role ${role}`);
        }
      }

      selectedRoles = flags.role;
    } else if (!flags.json) {
      const response = await inquirer.prompt([
        {
          name: 'role',
          message: 'Select user roles',
          type: 'checkbox',
          choices: roles,
        },
      ]);
      selectedRoles = response.role;
    }

    endpoint = `organizations/${this.userConfig.organization.current}/invites/`;
    const data = {
      email: flags.email,
      roles: selectedRoles,
    };
    const invite = await this.api.post<T.Invite>(endpoint, {body: JSON.stringify(data)}, false);
    this.log(invite.id);
    return {success: true, invite: invite};
  }
}
