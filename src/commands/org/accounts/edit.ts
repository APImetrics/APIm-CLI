import {Flags} from '@oclif/core';
import {Command, T} from '../../../base-command';

export default class Edit extends Command<{success: boolean}> {
  static description = 'Edit an account';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    'user-id': Flags.string({description: 'ID of user', char: 'u'}),
    'add-role': Flags.string({
      description: 'Add a role to the account.',
      multiple: true,
    }),
    'remove-role': Flags.string({
      description: 'Name of role to remove.',
      multiple: true,
    }),
    'org-id': Flags.string({
      description: 'ID of organization to modify. Overrides apimetrics config org set.',
      char: 'o',
    }),
  };

  public async run(): Promise<{success: boolean}> {
    const {flags} = await this.parse(Edit);

    const orgId = flags['org-id'] ? flags['org-id'] : this.userConfig.organization.current;
    if (orgId === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (orgId === '') {
      throw new Error(
        'Personal projects not currently supported. Please use web interface instead.'
      );
    }

    const rawRoles = await this.api.list<T.Role>(`organizations/${orgId}/roles/`);
    const roles: string[] = [];
    for (const role of rawRoles) {
      roles.push(role.id);
    }

    // We have to check these and then run additions separately to avoid
    // partial updates
    if (flags['add-role'] && flags['add-role'].length > 0) {
      for (const role of flags['add-role']) {
        if (!roles.includes(role)) {
          throw new Error(`Unrecognized role ${role}`);
        }
      }
    }

    if (flags['remove-role'] && flags['remove-role'].length > 0) {
      for (const role of flags['remove-role']) {
        if (!roles.includes(role)) {
          throw new Error(`Unrecognized role ${role}`);
        }
      }
    }

    const results = [];

    if (flags['add-role'] && flags['add-role'].length > 0) {
      for (const role of flags['add-role']) {
        results.push(
          this.api.post(`organizations/${orgId}/accounts/${flags['user-id']}/role/${role}/`, {})
        );
      }
    }

    if (flags['remove-role'] && flags['remove-role'].length > 0) {
      for (const role of flags['remove-role']) {
        results.push(
          this.api.delete(`organizations/${orgId}/accounts/${flags['user-id']}/role/${role}/`)
        );
      }
    }

    await Promise.all(results);

    return {
      success: true,
    };
  }
}
