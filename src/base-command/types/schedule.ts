export type Schedule = {
  id?: string;
  meta: {
    created?: string;
    last_update?: string;
    name: string;
    owner?: string;
    project_id: string;
    tags: string[];
  };
  schedule: {
    backoff_method: null | string;
    frequency: number;
    locations: string[];
    regions: string[];
    target_ids: string[];
  };
};
