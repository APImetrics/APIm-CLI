import {Flags} from '@oclif/core';
import {Command} from '../../../base-command';

export type DeleteResponse = {
  success: boolean;
};

export default class Delete extends Command<DeleteResponse> {
  static description = 'Delete an invite to the Organization.';

  static examples = [
    '<%= config.bin %> <%= command.id %> --invite-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9ajJsyoM',
  ];

  static flags = {
    'invite-id': Flags.string({
      description:
        'Invite to delete. Can be found in the Diff of the Audit Logs web page' +
        ' for when the invite was created or by using the command' +
        ' `apimetrics org invites --columns email,roles,id`.',
      required: true,
    }),
    'org-id': Flags.string({
      description:
        'ID of organization to modify. Overrides apimetrics config org set.' +
        'Can be found on the Organization Settings web page.',
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

    const endpoint = `organizations/${orgId}/invites/${flags['invite-id']}/`;
    await this.api.delete(endpoint);
    return {success: true};
  }
}
