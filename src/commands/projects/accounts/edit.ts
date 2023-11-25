import {Flags, ux} from '@oclif/core';
import {Command, T, util} from '../../../base-command/index.js';

export default class Edit extends Command<{success: boolean; warnings?: string[]}> {
  static description = 'Edit account access for the project.';
  private warnings: string[] = [];

  static examples = [
    '<%= config.bin %> <%= command.id %> --add-owner auth0|abcdefghijklmnopqrstuvwx --remove-viewer auth0|zyxwvutsrqponmlkjihgfedc',
  ];

  static flags = {
    'add-owner': Flags.string({
      description: 'ID or email of user to add as an owner.',
      multiple: true,
    }),
    'remove-owner': Flags.string({
      description: 'ID or email of user to remove as an owner',
      multiple: true,
    }),
    'add-editor': Flags.string({
      description: 'ID or email of user to add as an editor.',
      multiple: true,
    }),
    'remove-editor': Flags.string({
      description: 'ID or email of user to remove as an editor',
      multiple: true,
    }),
    'add-analyst': Flags.string({
      description: 'ID or email of user to add as an analyst.',
      multiple: true,
    }),
    'remove-analyst': Flags.string({
      description: 'ID or email of user to remove as an analyst',
      multiple: true,
    }),
    'add-viewer': Flags.string({
      description: 'ID or email of user to add as a viewer.',
      multiple: true,
    }),
    'remove-viewer': Flags.string({
      description: 'ID or email of user to remove as an viewer',
      multiple: true,
    }),
    'project-id': Flags.string({
      description:
        'ID of project to read. Overrides apimetrics config project set. This must be in the specified organization.',
      char: 'p',
    }),
  };

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
    // eslint-disable-next-line camelcase
  ): {access_level: string; account_id: string}[] {
    // eslint-disable-next-line camelcase
    const toAdd: {access_level: string; account_id: string}[] = [];
    if (accounts) {
      for (const account of accounts) {
        // eslint-disable-next-line camelcase
        toAdd.push({access_level: level, account_id: account});
      }
    }

    return toAdd;
  }

  public async run(): Promise<{success: boolean; warnings?: string[]}> {
    const {flags} = await this.parse(Edit);

    const orgId =
      flags['project-id'] && flags['project-id'] !== this.api.project
        ? (await this.api.get<T.Project>('project/')).org_id
        : this.userConfig.organization.current;

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
    const toId = (value: string) => {
      return util.validateEmail(value) ? util.getUserIdFromOrg(orgAccounts, value) : value;
    };

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
}
