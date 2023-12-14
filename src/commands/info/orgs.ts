import {ux} from '@oclif/core';
import {Command, T} from '../../base-command';

export type OrgList = {
  success: boolean;
  organizations: T.UserProjects['organizations'];
  roles: T.UserProjects['meta']['roles'];
};

export default class Orgs extends Command<OrgList> {
  static description = 'List all Organizations the current user is a member of.';

  static examples = [
    `<%= config.bin %> <%= command.id %>
Name                         ID        Subscription Level
──────────────────────────── ──────── ──────────────────
Org with Enterprise contract companya CONTRACT
An Org                       companyb PLAN
`,
  ];

  static flags = {
    ...ux.table.flags(),
  };

  public async run(): Promise<OrgList> {
    const {flags} = await this.parse(Orgs);

    const {
      organizations,
      meta: {roles},
    } = await this.api.get<T.UserProjects>('account/projects');

    ux.table(
      Object.values(organizations),
      {
        name: {
          get: (row) => row.name,
        },
        id: {
          header: 'ID',
          get: (row) => row.id,
        },
        roles: {
          get: (row) => roles[row.id]?.join(', ') || '',
        },
        subscriptionLevel: {
          header: 'Subscription Level',
          get: (row) => row.subscription_level,
        },
        billingAdminID: {
          header: 'Billing Admin ID',
          get: (row) => row.billing_admin_id,
          extended: true,
        },
        enforce2fa: {
          header: 'Enforce 2FA',
          get: (row) => row.enforce_2fa,
          extended: true,
        },
        passwordExpiryDays: {
          header: 'Password Expiry Days',
          get: (row) => row.password_expiry_days,
          extended: true,
        },
        kmsEnabled: {
          header: 'KMS Enabled',
          get: (row) => row.kms_enabled,
          extended: true,
        },
        tags: {
          get: (row) => row.tags.join(', '),
          extended: true,
        },
        systemTags: {
          header: 'System Tags',
          get: (row) => row.system_tags.join(', '),
          extended: true,
        },
        created: {
          get: (row) => row.created,
          extended: true,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, organizations: organizations, roles: roles};
  }
}
