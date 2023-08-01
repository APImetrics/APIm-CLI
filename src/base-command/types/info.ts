/* eslint-disable camelcase */
export type Info = {
  agent_list: {
    meta: {
      last_update: string;
      created: string;
      id: string;
      remote_addr: string;
      name: string;
    };
    id: string;
  }[];
  regions: {
    id: string;
    name?: string;
    locations: string[];
  }[];
  locations: Record<string, string>;
  postman_locations: string[];
};
