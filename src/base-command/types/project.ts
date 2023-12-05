 
export type Project = {
  created: string;
  id: string;
  last_update: string;
  name: string;
  org_id: string;
  sub_info: {
    counts: {
      last_hour_dt?: number;
      last_hour_run_count?: number;
      org_test_run_count?: number;
      public_report_count?: number;
      scheduled_test_count?: number;
      test_setup_count?: number;
      user_test_run_count?: number;
    };
    has_trial_expired?: boolean;
    monthly_progress: number;
    quotas: {
      public_report_quota: number;
      test_run_quota: number;
      test_setup_quota: number;
    };
    sub: {
      end: string;
      level: string;
      name: string;
      plan: string;
      start: string;
      state: string;
    };
    trial_expiry_date?: string;
  };
  system_tags: string[];
  tags: string[];
};
