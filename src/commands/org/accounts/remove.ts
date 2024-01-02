import {Flags} from '@oclif/core';

import {Command, T, util} from '../../../base-command';

export default class Remove extends Command<{success: boolean}> {
  static description = 'Remove an account from the organization.';

  static examples = [
    '<%= config.bin %> <%= command.id %> --user-id "auth0|abcdefghijklmnopqrstuvwx"',
  ];

  static flags = {
    'org-id': Flags.string({
      char: 'o',
      description: 'ID of organization to modify. Overrides apimetrics config org set.',
    }),
    'user-id': Flags.string({
      char: 'u',
      description:
        'ID or email of user to remove. ID can be found in the Accounts section of the Organization' +
        ' Settings web page or by using the command' +
        ' `apimetrics org accounts --columns name,id`.',
      required: true,
    }),
  };

  public async run(): Promise<{success: boolean}> {
    const {flags} = await this.parse(Remove);

    const orgId = flags['org-id'] ?? this.userConfig.organization.current;
    if (orgId === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (orgId === '') {
      throw new Error(
        'Personal projects not currently supported. Please use web interface instead.'
      );
    }

    let userId: string;
    if (util.validateEmail(flags['user-id'])) {
      const orgAccounts = await this.api.list<T.OrgAccount>(`organizations/${orgId}/accounts/`);
      userId = util.getUserIdFromOrg(orgAccounts, flags['user-id']);
    } else {
      userId = flags['user-id'];
    }

    await this.api.delete(`organizations/${orgId}/accounts/${userId}/`);
    return {success: true};
  }
}
