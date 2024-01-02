import {Flags} from '@oclif/core';

import {Command} from '../../../base-command';

export default class Delete extends Command<{success: boolean}> {
  static description = 'Delete a role from the organization.';

  static examples = ['<%= config.bin %> <%= command.id %> --role TEAM_A'];

  static flags = {
    'org-id': Flags.string({
      char: 'o',
      description:
        'ID of organization to modify. Overrides apimetrics config org set.' +
        'Can be found on the Organization Settings web page.',
    }),
    role: Flags.string({
      char: 'r',
      description:
        'ID of role to delete. This is the name of the role capitalized' +
        ' and with whitespace replaced by underscores.',
      required: true,
    }),
  };

  public async run(): Promise<{success: boolean}> {
    const {flags} = await this.parse(Delete);

    const orgId = flags['org-id'] ?? this.userConfig.organization.current;
    if (orgId === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (orgId === '') {
      throw new Error('Organization roles not supported for personal projects.');
    }

    const endpoint = `organizations/${orgId}/roles/${flags.role}/`;
    await this.api.delete(endpoint);
    return {success: true};
  }
}
