/* eslint-disable camelcase */
export type Schedule = {
  meta: {
    name: string;
    created: string;
    tags: string[];
    last_update: string;
    owner: string;
    project_id: string;
  };
  schedule: {
    regions: string[];
    frequency: number;
    locations: string;
    target_ids: string[];
    backoff_method: string | null;
  };
  id: string;
};
