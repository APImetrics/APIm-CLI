export type Downtime = {
  id: string;
  meta: {
    created: string;
    last_update: string;
    project_id: string;
    schedule_id: string;
  };
  schedule: {
    end_time: string;
    repeat_days: number;
    repeated: boolean;
    start_time: string;
  };
};
