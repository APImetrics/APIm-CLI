/* eslint-disable camelcase */
export type Invite = {
  name: string;
  roles: string[];
  created: string;
  org_id: string;
  invited_by: string;
  last_update: string;
  access_level: string;
  email: string;
  id: string;
  project_id?: string;
  invited_email: string;
};
