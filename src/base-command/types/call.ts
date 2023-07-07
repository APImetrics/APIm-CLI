/* eslint-disable camelcase */
export type Call = {
  meta: {
    domain: string;
    description: string | null;
    created: string;
    tags: string[];
    accept: string | null;
    last_update: string;
    content_type: string | null;
    owner: string;
    name: string;
    project_id: string;
  };
  request: {
    body: string | null;
    parameters: {
      key: string;
      value: string;
    }[];
    url: string;
    auth_id: string | null;
    headers: {
      key: string;
      value: string;
    }[];
    token_id: string | null;
    method: string;
  };
  id: string;
};
