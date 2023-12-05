 
export type OrgAccount = {
  app_metadata?: Record<string, unknown>;
  authenticationmethod?: string;
  email: string;
  email_verified: boolean;
  family_name?: string;
  given_name?: string;
  id: string;
  identities: {
    connection: string;
    isSocial: boolean;
    provider: string;
    user_id: string;
  }[];
  issuer?: string;
  last_ip: string;
  last_login: string;
  locale?: string;
  logins_count: number;
  multifactor?: string[];
  multifactor_last_modified?: string;
  name: string;
  namedIdAttributes?: {
    format?: string;
    value?: string;
  };
  nickname: string;
  permissions: string[];
  picture: string;
  sessionIndex?: string;
  updated_at: string;
  user_id: string;
  user_metadata: {
    fav_orgs?: string[];
    fav_projects?: string[];
    use_mfa: boolean;
  };
};
