import {Flags} from '@oclif/core';
import {Command, T} from '../../base-command';

export type CreateJSON = {
  success: boolean;
  project: T.Project;
  warnings?: string[];
};

type AccessRequestBody = {
  // eslint-disable-next-line camelcase
  access_level: string;
  // eslint-disable-next-line camelcase
  account_id?: string;
  // eslint-disable-next-line camelcase
  role_id?: string;
};

export default class Create extends Command<CreateJSON> {
  static description = 'Create a new project in the Organization.';
  private warnings: string[] = [];

  static examples = [
    `<%= config.bin %> <%= command.id %> --name "My Project"
ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDgtdTd3QkM`,
    `<%= config.bin %> <%= command.id %> --name "My Project" --owner-role ADMIN --viewer-user "auth0|abcdefghijklmnopqrstuvwx"
ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDgtj9TyQkM`,
  ];

  static flags = {
    name: Flags.string({description: 'Name of project.', char: 'n', required: true}),
    'owner-user': Flags.string({
      description:
        'ID of user to give owner access. Can be found in the Accounts section of the Organization' +
        ' Settings web page or by using the command' +
        ' `apimetrics org accounts --columns name,id`.',
      multiple: true,
    }),
    'owner-role': Flags.string({
      description:
        'ID of role to give owner access. This is the name of the role capitalized' +
        ' and with whitespace replaced by underscores.',
      multiple: true,
    }),
    'editor-user': Flags.string({
      description:
        'ID of user to give editor access. Can be found in the Accounts section of the Organization' +
        ' Settings web page or by using the command' +
        ' `apimetrics org accounts --columns name,id`.',
      multiple: true,
    }),
    'editor-role': Flags.string({
      description:
        'ID of role to give editor access. This is the name of the role capitalized' +
        ' and with whitespace replaced by underscores.',
      multiple: true,
    }),
    'analyst-user': Flags.string({
      description:
        'ID of user to give analyst access. Can be found in the Accounts section of the Organization' +
        ' Settings web page or by using the command' +
        ' `apimetrics org accounts --columns name,id`.',
      multiple: true,
    }),
    'analyst-role': Flags.string({
      description:
        'ID of role to give analyst access. This is the name of the role capitalized' +
        ' and with whitespace replaced by underscores.',
      multiple: true,
    }),
    'viewer-user': Flags.string({
      description:
        'ID of user to give viewer access. Can be found in the Accounts section of the Organization' +
        ' Settings web page or by using the command' +
        ' `apimetrics org accounts --columns name,id`.',
      multiple: true,
    }),
    'viewer-role': Flags.string({
      description:
        'ID of role to give viewer access. This is the name of the role capitalized' +
        ' and with whitespace replaced by underscores.',
      multiple: true,
    }),
    'org-id': Flags.string({
      description:
        'ID of organization to modify. Overrides apimetrics config org set.' +
        'Can be found on the Organization Settings web page.',
      char: 'o',
    }),
  };

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

  public async run(): Promise<CreateJSON> {
    const {flags} = await this.parse(Create);

    const orgId = flags['org-id'] ? flags['org-id'] : this.userConfig.organization.current;
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
    return {success: this.warnings.length === 0, project: project, warnings: this.warnings};
  }
}
