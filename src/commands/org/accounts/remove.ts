import {Flags} from '@oclif/core';
import {Command} from '../../../base-command';

export default class Remove extends Command<{success: boolean}> {
  static description = 'Remove an account';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    'user-id': Flags.string({description: 'ID of user', char: 'u', required: true}),
    'org-id': Flags.string({
      description: 'ID of organization to modify. Overrides apimetrics config org set.',
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

    return {
      success: true,
    };
  }
}
