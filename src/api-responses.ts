export type Call = {
  meta: {
    domain: string;
    description: string | null;
    created: string;
    tags: string[];
    accept: string | null;
    // eslint-disable-next-line camelcase
    last_update: string;
    // eslint-disable-next-line camelcase
    content_type: string | null;
    owner: string;
    name: string;
  };
  request: {
    body: string | null;
    parameters: {
      key: string;
      value: string;
    }[];
    url: string;
    // eslint-disable-next-line camelcase
    auth_id: string | null;
    headers: {
      key: string;
      value: string;
    }[];
    // eslint-disable-next-line camelcase
    token_id: string | null;
    method: string;
  };
};
