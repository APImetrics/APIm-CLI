export type Workflow = {
  id?: string;
  meta: {
    created?: string;
    deployments?: null | string;
    description: null | string;
    last_update?: string;
    name: string;
    owner?: string;
    project_id?: string;
    tags: string[];
    workspace?: string;
  };
  workflow: {
    call_ids: string[];
    handle_cookies: boolean;
    stop_on_failure: boolean;
  };
};
