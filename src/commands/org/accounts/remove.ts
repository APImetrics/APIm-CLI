import {Flags} from '@oclif/core';
import {Command} from '../../../base-command';

export default class Remove extends Command<{success: boolean}> {
  static description = 'Remove an account from the organization.';

  static examples = [
    '<%= config.bin %> <%= command.id %> --user-id "auth0|abcdefghijklmnopqrstuvwx"',
  ];

  static flags = {
    'user-id': Flags.string({
      description:
        'ID of user to remove. Can be found in the Accounts section of the Organization' +
        ' Settings web page or by using the command' +
        ' `apimetrics org accounts --columns name,id`.',
      char: 'u',
      required: true,
    }),
    'org-id': Flags.string({
      description:
        'ID of organization to modify. Overrides apimetrics config org set.' +
        'Can be found on the Organization Settings web page.',
      char: 'o',
    }),
  };

  public async run(): Promise<{success: boolean}> {
    const {flags} = await this.parse(Remove);

    const orgId = flags['org-id'] ? flags['org-id'] : this.userConfig.organization.current;
    if (orgId === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (orgId === '') {
      throw new Error(
        'Personal projects not currently supported. Please use web interface instead.'
      );
    }

    await this.api.delete(`organizations/${orgId}/accounts/${flags['user-id']}/`);
    return {success: true};
  }
}
