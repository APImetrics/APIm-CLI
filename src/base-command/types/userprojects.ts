 
export type UserProjects = {
  meta: {
    account_id: boolean;
    current_project_id: string;
    new_project: boolean;
    permissions: string[];
    roles: Record<string, string[]>;
    verify_needed: boolean;
  };
  organizations: Record<
    string,
    {
      billing_admin_id?: string;
      created: string;
      enforce_2fa: boolean;
      id: string;
      kms_enabled: boolean;
      last_update: string;
      name: string;
      password_expiry_days: number;
      subscription_level: string;
      system_tags: string[];
      tags: string[];
    }
  >;
  projects: {
    access_level: string;
    created: string;
    id: string;
    last_update: string;
    project: {
      created: string;
      id: string;
      last_update: string;
      name: string;
      org_id: string;
      system_tags: string[];
      tags: string[];
    };
    role_id: string;
  }[];
};
