 
export type Info = {
  agent_list: {
    id: string;
    meta: {
      created: string;
      id: string;
      last_update: string;
      name: string;
      remote_addr: string;
    };
  }[];
  locations: Record<string, string>;
  postman_locations: string[];
  regions: {
    id: string;
    locations: string[];
    name?: string;
  }[];
};
