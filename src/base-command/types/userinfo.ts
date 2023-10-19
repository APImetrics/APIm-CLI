/* eslint-disable camelcase */
export type UserInfo = {
  sub: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: string;
  'https://client.apimetrics.io/org_ids': string[];
  'https://client.apimetrics.io/roles': Record<string, string[]>;
  'https://client.apimetrics.io/permissions': string[];
  'https://client.apimetrics.io/use_mfa': boolean;
  'https://client.apimetrics.io/fav_orgs': string[];
  'https://client.apimetrics.io/fav_projects': string[];
};
