/* eslint-disable camelcase */
export type Access = {
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
  account_email: string;
  created: string;
  id: string;
  account_id?: string;
  role_id?: string;
  last_update: string;
};
