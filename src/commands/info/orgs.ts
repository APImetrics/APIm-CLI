import {ux} from '@oclif/core';

import {Command, T} from '../../base-command';

export type OrgList = {
  organizations: T.UserProjects['organizations'];
  roles: T.UserProjects['meta']['roles'];
  success: boolean;
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
      meta: {roles},
      organizations,
    } = await this.api.get<T.UserProjects>('account/projects');

    ux.table(
      Object.values(organizations),
      {
        billingAdminID: {
          extended: true,
          get: (row) => row.billing_admin_id,
          header: 'Billing Admin ID',
        },
        created: {
          extended: true,
          get: (row) => row.created,
        },
        enforce2fa: {
          extended: true,
          get: (row) => row.enforce_2fa,
          header: 'Enforce 2FA',
        },
        id: {
          get: (row) => row.id,
          header: 'ID',
        },
        kmsEnabled: {
          extended: true,
          get: (row) => row.kms_enabled,
          header: 'KMS Enabled',
        },
        name: {
          get: (row) => row.name,
        },
        passwordExpiryDays: {
          extended: true,
          get: (row) => row.password_expiry_days,
          header: 'Password Expiry Days',
        },
        roles: {
          get: (row) => roles[row.id]?.join(', ') || '',
        },
        subscriptionLevel: {
          get: (row) => row.subscription_level,
          header: 'Subscription Level',
        },
        systemTags: {
          extended: true,
          get: (row) => row.system_tags.join(', '),
          header: 'System Tags',
        },
        tags: {
          extended: true,
          get: (row) => row.tags.join(', '),
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {organizations, roles, success: true};
  }
}
