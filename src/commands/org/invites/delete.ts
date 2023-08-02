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
  };

  public async run(): Promise<DeleteResponse> {
    const {flags} = await this.parse(Delete);

    if (this.userConfig.organization.current === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (this.userConfig.organization.current === '') {
      throw new Error('organization invites not supported for personal projects');
    }

    let inviteId: string;
    if (flags['invite-id']) {
      inviteId = flags['invite-id'];
    } else if (flags.json) {
      throw new Error('No invite selected for deletion.');
    } else {
      const endpoint = `organizations/${this.userConfig.organization.current}/invites/`;
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

    const endpoint = `organizations/${this.userConfig.organization.current}/invites/${inviteId}/`;
    await this.api.delete(endpoint);
    return {success: true};
  }
}
