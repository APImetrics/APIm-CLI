/* eslint-disable camelcase */
export type OrgAccount = {
  picture: string;
  user_id: string;
  name: string;
  family_name?: string;
  given_name?: string;
  email_verified: boolean;
  last_ip: string;
  updated_at: string;
  locale?: string;
  app_metadata?: Record<string, unknown>;
  last_login: string;
  user_metadata: {
    use_mfa: boolean;
    fav_projects?: string[];
    fav_orgs?: string[];
  };
  sessionIndex?: string;
  namedIdAttributes?: {
    value?: string;
    format?: string;
  };
  multifactor_last_modified?: string;
  multifactor?: string[];
  id: string;
  identities: {
    isSocial: boolean;
    connection: string;
    user_id: string;
    provider: string;
  }[];
  nickname: string;
  email: string;
  logins_count: number;
  permissions: string[];
  authenticationmethod?: string;
  issuer?: string;
};
