/* eslint-disable camelcase */
export type Downtime = {
  meta: {
    project_id: string;
    schedule_id: string;
    created: string;
    last_update: string;
  };
  schedule: {
    repeat_days: number;
    start_time: string;
    end_time: string;
    repeated: boolean;
  };
  id: string;
};
