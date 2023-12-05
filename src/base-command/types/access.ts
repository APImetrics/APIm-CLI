 
export type Access = {
  access_level: string;
  account_email: string;
  account_id?: string;
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
  role_id?: string;
};
