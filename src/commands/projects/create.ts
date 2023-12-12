import {Flags} from '@oclif/core';

import {Command, T} from '../../base-command';

export type CreateJSON = {
  project: T.Project;
  success: boolean;
  warnings?: string[];
};

type AccessRequestBody = {
  access_level: string;

  account_id?: string;

  role_id?: string;
};

export default class Create extends Command<CreateJSON> {
  static description = 'Create a new project.';
  static examples = [
    `<%= config.bin %> <%= command.id %> --name "My Project"
ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDgtdTd3QkM`,
    `<%= config.bin %> <%= command.id %> --name "My Project" --owner-role ADMIN --viewer-user "auth0|abcdefghijklmnopqrstuvwx"
ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDgtj9TyQkM`,
  ];

  static flags = {
    'analyst-role': Flags.string({
      description: 'ID of role to give analyst access.',
      multiple: true,
    }),
    'analyst-user': Flags.string({
      description: 'ID of user to give analyst access.',
      multiple: true,
    }),
    'editor-role': Flags.string({
      description: 'ID of role to give editor access.',
      multiple: true,
    }),
    'editor-user': Flags.string({
      description: 'ID of user to give editor access.',
      multiple: true,
    }),
    name: Flags.string({char: 'n', description: 'Name of project.', required: true}),
    'org-id': Flags.string({
      char: 'o',
      description: 'ID of organization to modify. Overrides apimetrics config org set.',
    }),
    'owner-role': Flags.string({
      description: 'ID of role to give owner access.',
      multiple: true,
    }),
    'owner-user': Flags.string({
      description: 'ID of user to give owner access.',
      multiple: true,
    }),
    'viewer-role': Flags.string({
      description: 'ID of role to give viewer access.',
      multiple: true,
    }),
    'viewer-user': Flags.string({
      description: 'ID of user to give viewer access.',
      multiple: true,
    }),
  };

  private warnings: string[] = [];

  public async run(): Promise<CreateJSON> {
    const {flags} = await this.parse(Create);

    const orgId = flags['org-id'] ?? this.userConfig.organization.current;
    if (orgId === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (orgId === '') {
      throw new Error(
        'Personal projects not currently supported. Please use web interface instead.'
      );
    }

    const project = await this.api.post<T.Project>(`organizations/${orgId}/projects/`, {
      body: {name: flags.name},
    });
    this.log(project.id);

    const roles = await this.api.list<T.Role>(`organizations/${orgId}/roles/`);
    const accessToAdd = [
      ...this.parseUserIDs('OWNER', flags['owner-user']),
      ...this.parseUserIDs('EDITOR', flags['editor-user']),
      ...this.parseUserIDs('ANALYST', flags['analyst-user']),
      ...this.parseUserIDs('VIEWER', flags['viewer-user']),
      ...this.parseRoleIDs('OWNER', roles, flags['owner-role']),
      ...this.parseRoleIDs('EDITOR', roles, flags['editor-role']),
      ...this.parseRoleIDs('ANALYST', roles, flags['analyst-role']),
      ...this.parseRoleIDs('VIEWER', roles, flags['viewer-role']),
    ];

    const responses = [];
    for (const access of accessToAdd) {
      if (access.role_id) {
        responses.push(this.api.post(`projects/${project.id}/roles/`, {body: access}));
      } else {
        responses.push(this.api.post(`projects/${project.id}/access/`, {body: access}));
      }
    }

    await Promise.all(responses); // Wait for all requests to finish
    return {project, success: this.warnings.length === 0, warnings: this.warnings};
  }

  /**
   * Generate the request bodies for roles
   * @param level Access level for roles
   * @param validRoles Roles that exist in this organization
   * @param roles Roles to add to project
   * @returns Request bodies
   */
  private parseRoleIDs(level: string, validRoles: T.Role[], roles?: string[]): AccessRequestBody[] {
    const toAdd: AccessRequestBody[] = [];
    if (roles) {
      for (const role of roles) {
        if (validRoles.some((valid) => valid.id === role)) {
          // eslint-disable-next-line camelcase
          toAdd.push({access_level: level, role_id: role});
        } else {
          this.warn(`Unrecognised role ${role}. Skipping.`);
          this.warnings.push(`Unrecognised role ${role}. Skipping.`);
        }
      }
    }

    return toAdd;
  }

  /**
   * Generate the request bodies for user accounts
   * @param level Access level for account
   * @param accounts Array of accounts to add
   * @returns Formatted request bodies
   */
  private parseUserIDs(level: string, users?: string[]): AccessRequestBody[] {
    const toAdd: AccessRequestBody[] = [];
    if (users) {
      for (const id of users) {
        // eslint-disable-next-line camelcase
        toAdd.push({access_level: level, account_id: id});
      }
    }

    return toAdd;
  }
}
