import {Flags} from '@oclif/core';
import {Command, T} from '../../../base-command';
import * as inquirer from 'inquirer';

export type DeleteResponse = {
  success: boolean;
};

export default class Delete extends Command<DeleteResponse> {
  static description = 'Delete an invite to the project';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    'invite-id': Flags.string({description: 'Invite to delete'}),
    'project-id': Flags.string({
      description: 'ID of project to modify. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<DeleteResponse> {
    const {flags} = await this.parse(Delete);

    if (!this.userConfig.project.current && !flags['project-id']) {
      throw new Error(
        'Current working project not set. Run `apimetrics config project set` first.'
      );
    }

    const projectId = flags['project-id'] ? flags['project-id'] : this.userConfig.project.current;

    let inviteId: string;
    if (flags['invite-id']) {
      inviteId = flags['invite-id'];
    } else if (flags.json) {
      throw new Error('No invite selected for deletion.');
    } else {
      const endpoint = `projects/${projectId}/invites/`;
      const rawInvites = await this.api.list<T.Invite>(endpoint);
      const invites: {name: string; value: string}[] = [];
      for (const invite of rawInvites) {
        invites.push({
          name: `${invite.email} (${invite.access_level}) from ${invite.invited_email}`,
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

    const endpoint = `projects/${projectId}/invites/${inviteId}/`;
    await this.api.delete(endpoint);
    return {success: true};
  }
}
