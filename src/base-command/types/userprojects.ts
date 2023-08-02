/* eslint-disable camelcase */
export type UserProjects = {
  organizations: Record<
    string,
    {
      enforce_2fa: boolean;
      tags: string[];
      password_expiry_days: number;
      system_tags: string[];
      billing_admin_id?: string;
      kms_enabled: boolean;
      created: string;
      subscription_level: string;
      last_update: string;
      id: string;
      name: string;
    }
  >;
  meta: {
    verify_needed: boolean;
    account_id: boolean;
    roles: Record<string, string[]>;
    new_project: boolean;
    current_project_id: string;
    permissions: string[];
  };
  projects: {
    project: {
      name: string;
      tags: string[];
      system_tags: string[];
      created: string;
      org_id: string;
      id: string;
      last_update: string;
    };
    access_level: string;
    created: string;
    last_update: string;
    id: string;
    role_id: string;
  }[];
};
