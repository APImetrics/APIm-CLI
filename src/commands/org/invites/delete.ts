import {Flags} from '@oclif/core';

import {Command} from '../../../base-command';

export type DeleteResponse = {
  success: boolean;
};

export default class Delete extends Command<DeleteResponse> {
  static description = 'Delete an invite to the organization.';

  static examples = [
    '<%= config.bin %> <%= command.id %> --invite-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9ajJsyoM',
  ];

  static flags = {
    'invite-id': Flags.string({description: 'Invite to delete.', required: true}),
    'org-id': Flags.string({
      char: 'o',
      description: 'ID of organization to modify. Overrides apimetrics config org set.',
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

    const endpoint = `organizations/${orgId}/invites/${flags['invite-id']}/`;
    await this.api.delete(endpoint);
    return {success: true};
  }
}
