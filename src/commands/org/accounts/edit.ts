import {Flags} from '@oclif/core';
import {Command, T, util} from '../../../base-command/index.js';

export default class Edit extends Command<{success: boolean}> {
  static description = 'Edit an account.';

  static examples = [
    `<%= config.bin %> <%= command.id %> -u auth0|abc123 --add-role ADMIN --remove-role DEV_TEAM`,
  ];

  static flags = {
    'user-id': Flags.string({description: 'ID or email of user', char: 'u', required: true}),
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

    let userId: string;
    if (util.validateEmail(flags['user-id'])) {
      const orgAccounts = await this.api.list<T.OrgAccount>(`organizations/${orgId}/accounts/`);
      userId = util.getUserIdFromOrg(orgAccounts, flags['user-id']);
    } else {
      userId = flags['user-id'];
    }

    // Have to use roles currently attached to account. See #80
    const accountRoles: string[] = [];
    // Only need to call API if the user tries to remove any roles
    if (flags['remove-role'] && flags['remove-role'].length > 0) {
      const rawAccountRoles = await this.api.get<T.OrgAccount>(
        `organizations/${orgId}/accounts/${userId}`
      );

      // The location of permissions is not consistent, hence we need
      // to check a couple of different places
      if (rawAccountRoles.app_metadata) {
        if (
          rawAccountRoles.app_metadata.org_roles &&
          (rawAccountRoles.app_metadata.org_roles as Record<string, string[]>)[orgId]
        ) {
          for (const role of (rawAccountRoles.app_metadata.org_roles as Record<string, string[]>)[
            orgId
          ]) {
            accountRoles.push(role);
          }
        } else if (rawAccountRoles.app_metadata[orgId]) {
          for (const role of rawAccountRoles.app_metadata[orgId] as string[]) {
            accountRoles.push(role);
          }
        }
      } else if (rawAccountRoles.permissions) {
        for (const role of rawAccountRoles.permissions) {
          accountRoles.push(role);
        }
      }
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
        if (!accountRoles.includes(role)) {
          throw new Error(`${role} not found on user ${userId}.`);
        }
      }
    }

    const results = [];
    if (flags['add-role'] && flags['add-role'].length > 0) {
      for (const role of flags['add-role']) {
        results.push(this.api.post(`organizations/${orgId}/accounts/${userId}/role/${role}/`, {}));
      }
    }

    if (flags['remove-role'] && flags['remove-role'].length > 0) {
      for (const role of flags['remove-role']) {
        results.push(this.api.delete(`organizations/${orgId}/accounts/${userId}/role/${role}/`));
      }
    }

    await Promise.all(results);
    return {success: true};
  }
}
