import {Flags, ux} from '@oclif/core';

import {Command, T} from '../../../base-command';

export default class Edit extends Command<{success: boolean; warnings?: string[]}> {
  static description = 'Edit role access on the project.';
  static examples = ['<%= config.bin %> <%= command.id %> --add-owner ADMIN --remove-editor DEBUG'];

  static flags = {
    'add-analyst': Flags.string({
      description:
        'ID of role to add as an analyst. This is the name of the role capitalized' +
        ' and with whitespace replaced by underscores.',
      multiple: true,
    }),
    'add-editor': Flags.string({
      description:
        'ID of role to add as an editor. This is the name of the role capitalized' +
        ' and with whitespace replaced by underscores.',
      multiple: true,
    }),
    'add-owner': Flags.string({
      description:
        'ID of role to add as an owner. This is the name of the role capitalized' +
        ' and with whitespace replaced by underscores.',
      multiple: true,
    }),
    'add-viewer': Flags.string({
      description:
        'ID of role to add as a viewer. This is the name of the role capitalized' +
        ' and with whitespace replaced by underscores.',
      multiple: true,
    }),
    'project-id': Flags.string({
      char: 'p',
      description: 'ID of project to read. Overrides apimetrics config project set.',
    }),
    'remove-analyst': Flags.string({
      description:
        'ID of role to remove as an analyst. This is the name of the role capitalized' +
        ' and with whitespace replaced by underscores.',
      multiple: true,
    }),
    'remove-editor': Flags.string({
      description:
        'ID of role to remove as an editor. This is the name of the role capitalized' +
        ' and with whitespace replaced by underscores.',
      multiple: true,
    }),
    'remove-owner': Flags.string({
      description:
        'ID of role to remove as an owner. This is the name of the role capitalized' +
        ' and with whitespace replaced by underscores.',
      multiple: true,
    }),
    'remove-viewer': Flags.string({
      description:
        'ID of role to add as a viewer. This is the name of the role capitalized' +
        ' and with whitespace replaced by underscores.',
      multiple: true,
    }),
  };

  private warnings: string[] = [];

  public async run(): Promise<{success: boolean; warnings?: string[]}> {
    const {flags} = await this.parse(Edit);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const {org_id: orgId} = await this.api.get<T.Project>(`projects/${this.api.project}`);
    const roles = await this.api.list<T.Role>(`organizations/${orgId}/roles/`);

    const accessToAdd = [
      ...this.formatAccessRequests(roles, 'OWNER', flags['add-owner']),
      ...this.formatAccessRequests(roles, 'EDITOR', flags['add-editor']),
      ...this.formatAccessRequests(roles, 'ANALYST', flags['add-analyst']),
      ...this.formatAccessRequests(roles, 'VIEWER', flags['add-viewer']),
    ];

    const existingAccess = await this.api.list<T.Access>(`projects/${this.api.project}/roles/`);
    const accessToRemove: string[] = [
      ...this.getAccessIDs(existingAccess, 'OWNER', flags['remove-owner']),
      ...this.getAccessIDs(existingAccess, 'EDITOR', flags['remove-editor']),
      ...this.getAccessIDs(existingAccess, 'ANALYST', flags['remove-analyst']),
      ...this.getAccessIDs(existingAccess, 'VIEWER', flags['remove-viewer']),
    ];

    const responses = [];
    for (const access of accessToAdd) {
      responses.push(this.api.post(`projects/${this.api.project}/roles/`, {body: access}));
    }

    for (const access of accessToRemove) {
      responses.push(this.api.delete(`projects/${this.api.project}/roles/${access}/`));
    }

    await Promise.all(responses); // Wait for all requests to finish
    return {success: this.warnings.length === 0, warnings: this.warnings};
  }

  /**
   * Format request bodies for access requests
   * @param orgRoles Roles that currently exist on the organisation
   * @param level Access level to add role at
   * @param roles Array of IDs to add
   * @returns Array of access bodies ready for requests
   */
  private formatAccessRequests(
    orgRoles: T.Role[],
    level: string,
    roles?: string[]
  ): {access_level: string; role_id: string}[] {
    const add: {
      access_level: string;
      role_id: string;
    }[] = [];

    if (roles) {
      for (const role of roles) {
        if (orgRoles.some((access) => access.id === role)) {
          // eslint-disable-next-line camelcase
          add.push({access_level: level, role_id: role});
        } else {
          ux.warn(`Could not find role with ID ${role}. Skipping.`);
          this.warnings.push(`Could not find role with ID ${role}. Skipping.`);
        }
      }
    }

    return add;
  }

  /**
   * Get access IDs for roles to remove
   * @param existingAccess Roles who currently have access to project
   * @param level Access level to remove role at
   * @param roles Array of IDs to remove
   * @returns Array of access IDs ready for requests
   */
  private getAccessIDs(existingAccess: T.Access[], level: string, roles?: string[]): string[] {
    const removal: string[] = [];
    if (roles) {
      for (const role of roles) {
        const roleAccess = existingAccess.find(
          (access) => access.role_id === role && access.access_level === level
        );
        if (roleAccess) {
          removal.push(roleAccess.id);
        } else {
          ux.warn(`Could not find role with ID ${role} for access level ${level}. Skipping.`);
          this.warnings.push(
            `Could not find role with ID ${role} for access level ${level}. Skipping.`
          );
        }
      }
    }

    return removal;
  }
}
