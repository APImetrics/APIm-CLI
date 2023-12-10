export type Call = {
  id: string;
  meta: {
    accept: null | string;
    content_type: null | string;
    created: string;
    description: null | string;
    domain: string;
    last_update: string;
    name: string;
    owner: string;
    project_id: string;
    tags: string[];
  };
  request: {
    auth_id: null | string;
    body: null | string;
    headers: {
      key: string;
      value: string;
    }[];
    method: string;
    parameters: {
      key: string;
      value: string;
    }[];
    token_id: null | string;
    url: string;
  };
};
