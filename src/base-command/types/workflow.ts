/* eslint-disable camelcase */
export type Workflow = {
  meta: {
    project_id: string;
    name: string;
    workspace: string;
    tags: string[];
    owner: string;
    deployments: string | null;
    created: string;
    last_update: string;
    description: string | null;
  };
  workflow: {
    handle_cookies: boolean;
    call_ids: string[];
    stop_on_failure: boolean;
  };
  id: string;
};
