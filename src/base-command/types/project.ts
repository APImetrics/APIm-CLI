/* eslint-disable camelcase */
export type Project = {
  name: string;
  tags: string[];
  sub_info: {
    sub: {
      level: string;
      name: string;
      plan: string;
      start: string;
      end: string;
      state: string;
    };
    monthly_progress: number;
    quotas: {
      test_run_quota: number;
      test_setup_quota: number;
      public_report_quota: number;
    };
    has_trial_expired?: boolean;
    trial_expiry_date?: string;
    counts: {
      user_test_run_count?: number;
      org_test_run_count?: number;
      test_setup_count?: number;
      public_report_count?: number;
      scheduled_test_count?: number;
      last_hour_run_count?: number;
      last_hour_dt?: number;
    };
  };
  system_tags: string[];
  created: string;
  org_id: string;
  id: string;
  last_update: string;
};
