import {Flags, ux} from '@oclif/core';

import {Command, T, util} from '../../../base-command';

export default class Edit extends Command<{success: boolean; warnings?: string[]}> {
  static description = 'Edit account access for the Project.';
  static examples = [
    '<%= config.bin %> <%= command.id %> --add-owner auth0|abcdefghijklmnopqrstuvwx --remove-viewer auth0|zyxwvutsrqponmlkjihgfedc',
  ];

  static flags = {
    'add-analyst': Flags.string({
      description:
        'ID or email of user to add as an analyst. ID can be found in the Accounts section of the Organization' +
        ' Settings web page or by using the command' +
        ' `apimetrics org accounts --columns name,id`.',
      multiple: true,
    }),
    'add-editor': Flags.string({
      description:
        'ID or email of user to add as an editor. ID can be found in the Accounts section of the Organization' +
        ' Settings web page or by using the command' +
        ' `apimetrics org accounts --columns name,id`.',
      multiple: true,
    }),
    'add-owner': Flags.string({
      description:
        'ID or email of user to add as an owner. ID can be found in the Accounts section of the Organization' +
        ' Settings web page or by using the command' +
        ' `apimetrics org accounts --columns name,id`.',
      multiple: true,
    }),
    'add-viewer': Flags.string({
      description:
        'ID or email of user to add as a viewer. ID can be found in the Accounts section of the Organization' +
        ' Settings web page or by using the command' +
        ' `apimetrics org accounts --columns name,id`.',
      multiple: true,
    }),
    'project-id': Flags.string({
      char: 'p',
      description:
        'ID of project to delete. Overrides apimetrics config project set. This must be in the specified organization.' +
        ' ID an be found in the Project Settings web page under the admin' +
        ' section or by using the command `apimetrics projects --columns name,id`.',
    }),
    'remove-analyst': Flags.string({
      description:
        'ID or email of user to remove as an analyst. ID can be found in the Accounts section of the Organization' +
        ' Settings web page or by using the command' +
        ' `apimetrics org accounts --columns name,id`.',
      multiple: true,
    }),
    'remove-editor': Flags.string({
      description:
        'ID or email of user to remove as an editor. ID can be found in the Accounts section of the Organization' +
        ' Settings web page or by using the command' +
        ' `apimetrics org accounts --columns name,id`.',
      multiple: true,
    }),
    'remove-owner': Flags.string({
      description:
        'ID or email of user to remove as an owner. ID can be found in the Accounts section of the Organization' +
        ' Settings web page or by using the command' +
        ' `apimetrics org accounts --columns name,id`.',
      multiple: true,
    }),
    'remove-viewer': Flags.string({
      description:
        'ID or email of user to remove as a viewer. ID can be found in the Accounts section of the Organization' +
        ' Settings web page or by using the command' +
        ' `apimetrics org accounts --columns name,id`.',
      multiple: true,
    }),
  };

  private warnings: string[] = [];

  public async run(): Promise<{success: boolean; warnings?: string[]}> {
    const {flags} = await this.parse(Edit);

    let orgId: string | undefined;
    if (flags['project-id'] && flags['project-id'] !== this.api.project) {
      const response = await this.api.get<T.Project>('project/');
      orgId = response.org_id;
    } else {
      orgId = this.userConfig.organization.current;
    }

    if (orgId === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (orgId === '') {
      throw new Error(
        'Personal projects not currently supported. Please use web interface instead.'
      );
    }

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const orgAccounts = await this.api.list<T.OrgAccount>(`organizations/${orgId}/accounts/`);
    const toId = (value: string) =>
      util.validateEmail(value) ? util.getUserIdFromOrg(orgAccounts, value) : value;

    const accessToAdd = [
      ...this.parseAddAccess('OWNER', flags['add-owner']?.map(toId)),
      ...this.parseAddAccess('EDITOR', flags['add-editor']?.map(toId)),
      ...this.parseAddAccess('ANALYST', flags['add-analyst']?.map(toId)),
      ...this.parseAddAccess('VIEWER', flags['add-viewer']?.map(toId)),
    ];

    const existingAccess = await this.api.list<T.Access>(`projects/${this.api.project}/access/`);
    const accessToRemove: string[] = [
      ...this.getAccessIds(existingAccess, 'OWNER', flags['remove-owner']?.map(toId)),
      ...this.getAccessIds(existingAccess, 'EDITOR', flags['remove-editor']?.map(toId)),
      ...this.getAccessIds(existingAccess, 'ANALYST', flags['remove-analyst']?.map(toId)),
      ...this.getAccessIds(existingAccess, 'VIEWER', flags['remove-viewer']?.map(toId)),
    ];

    const responses = [];
    for (const access of accessToAdd) {
      responses.push(this.api.post(`projects/${this.api.project}/access/`, {body: access}));
    }

    for (const access of accessToRemove) {
      responses.push(this.api.delete(`projects/${this.api.project}/access/${access}/`));
    }

    await Promise.all(responses); // Wait for all requests to finish
    return {success: this.warnings.length === 0, warnings: this.warnings};
  }

  /**
   * Get access IDs for users to remove
   * @param existingAccess Users who currently have access to project
   * @param level Access level to remove role at
   * @param accounts Array of IDs to remove
   * @returns Array of access IDs ready for requests
   */
  private getAccessIds(existingAccess: T.Access[], level: string, accounts?: string[]): string[] {
    const removal: string[] = [];
    if (accounts) {
      for (const account of accounts) {
        const userAccess = existingAccess.find(
          (access) => access.account_id === account && access.access_level === level
        );
        if (userAccess) {
          removal.push(userAccess.id);
        } else {
          ux.warn(`Could not find account with ID ${account} for access level ${level}. Skipping.`);
          this.warnings.push(
            `Could not find account with ID ${account} for access level ${level}. Skipping.`
          );
        }
      }
    }

    return removal;
  }

  /**
   * Format request bodies for access requests
   * @param level Access level to add accounts for
   * @param accounts Accounts to add
   * @returns Request bodies
   */
  private parseAddAccess(
    level: string,
    accounts?: string[]
  ): {access_level: string; account_id: string}[] {
    const toAdd: {access_level: string; account_id: string}[] = [];
    if (accounts) {
      for (const account of accounts) {
        // eslint-disable-next-line camelcase
        toAdd.push({access_level: level, account_id: account});
      }
    }

    return toAdd;
  }
}
