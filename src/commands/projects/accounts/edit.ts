import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../../base-command';

export default class Edit extends Command<{success: boolean; warnings?: string[]}> {
  static description = 'Edit account access on a project';
  private warnings: string[] = [];

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    'add-owner': Flags.string({
      description: 'ID of user to add as an owner.',
      multiple: true,
    }),
    'remove-owner': Flags.string({
      description: 'ID of user to remove as an owner',
      multiple: true,
    }),
    'add-editor': Flags.string({
      description: 'ID of user to add as an editor.',
      multiple: true,
    }),
    'remove-editor': Flags.string({
      description: 'ID of user to remove as an editor',
      multiple: true,
    }),
    'add-analyst': Flags.string({
      description: 'ID of user to add as an analyst.',
      multiple: true,
    }),
    'remove-analyst': Flags.string({
      description: 'ID of user to remove as an analyst',
      multiple: true,
    }),
    'add-viewer': Flags.string({
      description: 'ID of user to add as a viewer.',
      multiple: true,
    }),
    'remove-viewer': Flags.string({
      description: 'ID of user to remove as an viewer',
      multiple: true,
    }),
    'project-id': Flags.string({
      description: 'ID of project to read. Overrides apimetrics config project set.',
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
  private getAccessIDs(existingAccess: T.Access[], level: string, accounts?: string[]): string[] {
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

  public async run(): Promise<{success: boolean; warnings?: string[]}> {
    const {flags} = await this.parse(Edit);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    if (
      flags['add-owner'] ||
      flags['remove-owner'] ||
      flags['add-editor'] ||
      flags['remove-editor'] ||
      flags['add-analyst'] ||
      flags['remove-analyst'] ||
      flags['add-viewer'] ||
      flags['remove-viewer']
    ) {
      const accessToAdd: {
        // eslint-disable-next-line camelcase
        access_level: string;
        // eslint-disable-next-line camelcase
        account_id?: string;
      }[] = [];

      if (flags['add-owner']) {
        for (const account of flags['add-owner']) {
          // eslint-disable-next-line camelcase
          accessToAdd.push({access_level: 'OWNER', account_id: account});
        }
      }

      if (flags['add-editor']) {
        for (const account of flags['add-editor']) {
          // eslint-disable-next-line camelcase
          accessToAdd.push({access_level: 'EDITOR', account_id: account});
        }
      }

      if (flags['add-analyst']) {
        for (const account of flags['add-analyst']) {
          // eslint-disable-next-line camelcase
          accessToAdd.push({access_level: 'ANALYST', account_id: account});
        }
      }

      if (flags['add-viewer']) {
        for (const account of flags['add-viewer']) {
          // eslint-disable-next-line camelcase
          accessToAdd.push({access_level: 'VIEWER', account_id: account});
        }
      }

      const existingAccess = await this.api.list<T.Access>(`projects/${this.api.project}/access/`);
      const accessToRemove: string[] = [
        ...this.getAccessIDs(existingAccess, 'OWNER', flags['remove-owner']),
        ...this.getAccessIDs(existingAccess, 'EDITOR', flags['remove-editor']),
        ...this.getAccessIDs(existingAccess, 'ANALYST', flags['remove-analyst']),
        ...this.getAccessIDs(existingAccess, 'VIEWER', flags['remove-viewer']),
      ];

      const responses = [];
      for (const access of accessToAdd) {
        responses.push(
          this.api.post(`projects/${this.api.project}/access/`, {body: JSON.stringify(access)})
        );
      }

      for (const access of accessToRemove) {
        responses.push(this.api.delete(`projects/${this.api.project}/access/${access}/`));
      }

      await Promise.all(responses); // Wait for all requests to finish
    }

    return {success: this.warnings.length === 0, warnings: this.warnings};
  }
}
