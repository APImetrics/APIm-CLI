/* eslint-disable camelcase */
export type OIDCWellKnown = {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  device_authorization_endpoint: string;
  userinfo_endpoint: string;
  mfa_challenge_endpoint: string;
  jwks_uri: string;
  registration_endpoint: string;
  revocation_endpoint: string;
  scopes_supported: string[];
  response_types_supported: string[];
  code_challenge_methods_supported: string[];
  response_modes_supported: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  token_endpoint_auth_methods_supported: string[];
  claims_supported: string[];
  request_uri_parameter_supported: boolean;
  request_parameter_supported: boolean;
  token_endpoint_auth_signing_alg_values_supported: string[];
  backchannel_logout_supported: boolean;
  backchannel_logout_session_supported: boolean;
};
