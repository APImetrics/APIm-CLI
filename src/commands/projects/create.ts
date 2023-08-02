import {Flags} from '@oclif/core';
import {Command, T, util} from '../../base-command';

export type CreateJSON = {
  success: boolean;
  project: T.Project;
  warnings?: string[];
};

export default class Create extends Command<CreateJSON> {
  static description = 'Create a new project';
  private warnings: string[] = [];

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    name: Flags.string({description: 'Name of project', char: 'n', required: true}),
    owner: Flags.string({
      description: 'Name of role or email of user to give owner access',
      multiple: true,
    }),
    editor: Flags.string({
      description: 'Name of role or email of user to give editor access',
      multiple: true,
    }),
    analyst: Flags.string({
      description: 'Name of role or email of user to give analyst access',
      multiple: true,
    }),
    viewer: Flags.string({
      description: 'Name of role or email of user to give viewer access',
      multiple: true,
    }),
  };

  /**
   * Checks if role or account exists on an organization. If it does,
   * return formatted request body, else raise a warning
   * @param accounts Accounts to check against
   * @param roles Roles to check against
   * @param accessLevel Access level for role / account
   * @param roleOrAccount Name of role or email of account
   * @returns Formatted request body
   */
  private formatAccessRequestBody(
    accounts: T.OrgAccount[],
    roles: T.Role[],
    accessLevel: string,
    roleOrAccount: string
    // eslint-disable-next-line camelcase
  ): {access_level: string; account_id?: string; email?: string; role_id?: string} | undefined {
    if (util.validateEmail(roleOrAccount)) {
      const i = accounts.findIndex((val) => val.email === roleOrAccount);
      if (i > -1) {
        return {
          // eslint-disable-next-line camelcase
          access_level: accessLevel,
          // eslint-disable-next-line camelcase
          account_id: accounts[i].id,
          email: roleOrAccount,
        };
      }
    }

    if (roles.some((val) => val.id === roleOrAccount)) {
      return {
        // eslint-disable-next-line camelcase
        access_level: accessLevel,
        // eslint-disable-next-line camelcase
        role_id: roleOrAccount,
      };
    }

    this.warn(`Unrecognised role or account ${roleOrAccount}. Skipping`);
    this.warnings.push(`Unrecognised role or account ${roleOrAccount}. Skipping`);
  }

  public async run(): Promise<CreateJSON> {
    const {flags} = await this.parse(Create);

    if (this.userConfig.organization.current === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (this.userConfig.organization.current === '') {
      throw new Error(
        'Creating personal projects not currently supported. Please use web interface instead.'
      );
    }

    const endpoint = `organizations/${this.userConfig.organization.current}/projects/`;
    const project = await this.api.post<T.Project>(endpoint, {
      body: JSON.stringify({name: flags.name}),
    });
    this.log(project.id);

    if (flags.owner || flags.editor || flags.analyst || flags.viewer) {
      const roles = await this.api.list<T.Role>(
        `organizations/${this.userConfig.organization.current}/roles/`
      );
      const accounts = await this.api.list<T.OrgAccount>(
        `organizations/${this.userConfig.organization.current}/accounts/`
      );

      const accessToAdd: {
        // eslint-disable-next-line camelcase
        access_level: string;
        // eslint-disable-next-line camelcase
        account_id?: string;
        email?: string;
        // eslint-disable-next-line camelcase
        role_id?: string;
      }[] = [];

      if (flags.owner) {
        for (const owner of flags.owner) {
          const access = this.formatAccessRequestBody(accounts, roles, 'OWNER', owner);
          if (access) {
            accessToAdd.push(access);
          }
        }
      }

      if (flags.editor) {
        for (const editor of flags.editor) {
          const access = this.formatAccessRequestBody(accounts, roles, 'EDITOR', editor);
          if (access) {
            accessToAdd.push(access);
          }
        }
      }

      if (flags.analyst) {
        for (const analyst of flags.analyst) {
          const access = this.formatAccessRequestBody(accounts, roles, 'ANALYST', analyst);
          if (access) {
            accessToAdd.push(access);
          }
        }
      }

      if (flags.viewer) {
        for (const viewer of flags.viewer) {
          const access = this.formatAccessRequestBody(accounts, roles, 'VIEWER', viewer);
          if (access) {
            accessToAdd.push(access);
          }
        }
      }

      const responses = [];
      for (const access of accessToAdd) {
        if (access.role_id) {
          responses.push(
            this.api.post(`projects/${project.id}/roles/`, {body: JSON.stringify(access)})
          );
        } else {
          responses.push(
            this.api.post(`projects/${project.id}/access/`, {body: JSON.stringify(access)})
          );
        }
      }

      await Promise.all(responses); // Wait for all requests to finish
      return {success: this.warnings.length === 0, project: project, warnings: this.warnings};
    }

    return {success: true, project: project};
  }
}
