export type UserInfo = {
  email: string;
  email_verified: string;
  'https://client.apimetrics.io/fav_orgs': string[];
  'https://client.apimetrics.io/fav_projects': string[];
  'https://client.apimetrics.io/org_ids': string[];
  'https://client.apimetrics.io/permissions': string[];
  'https://client.apimetrics.io/roles': Record<string, string[]>;
  'https://client.apimetrics.io/use_mfa': boolean;
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;
};
