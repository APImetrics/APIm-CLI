import {Flags} from '@oclif/core';
import {Command, T} from '../../../base-command';
import * as inquirer from 'inquirer';

export type DeleteResponse = {
  success: boolean;
};

export default class Delete extends Command<DeleteResponse> {
  static description = 'Delete an invite to the organization';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    'invite-id': Flags.string({description: 'Invite to delete'}),
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
      throw new Error('Organization invites not supported for personal projects.');
    }

    let inviteId: string;
    if (flags['invite-id']) {
      inviteId = flags['invite-id'];
    } else if (flags.json) {
      throw new Error('No invite selected for deletion.');
    } else {
      const endpoint = `organizations/${orgId}/invites/`;
      const rawInvites = await this.api.list<T.Invite>(endpoint);
      const invites: {name: string; value: string}[] = [];
      for (const invite of rawInvites) {
        invites.push({
          name: `${invite.email} (${invite.roles.join(', ') || 'None'}) from ${
            invite.invited_email
          }`,
          value: invite.id,
        });
      }

      const response = await inquirer.prompt([
        {
          name: 'invite',
          message: 'Select invite to delete',
          type: 'list',
          choices: invites,
        },
      ]);
      inviteId = response.invite;
    }

    const endpoint = `organizations/${orgId}/invites/${inviteId}/`;
    await this.api.delete(endpoint);
    return {success: true};
  }
}
