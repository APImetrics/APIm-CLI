export type Webhook = {
  id?: string;
  meta: {
    call_id?: string;
    created?: string;
    exclude_tags: string[];
    include_tags: string[];
    last_update?: string;
    name: string;
    owner?: string;
    project_id?: string;
    project_webhook?: boolean;
    tags?: string[];
  };
  webhook: {
    alerts: ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[];
    enabled: boolean;
    parameters: {
      api_key?: string;
      app_key?: string;
      call_id?: string;
      channel?: string;
      component_id?: string;
      email_address?: string;
      fails_in_a_row?: string;
      flow_token?: string;
      integration_key?: string;
      page_id?: string;
      password?: string;
      routing_key?: string;
      severity?: 'critical' | 'error' | 'info' | 'warning';
      subject_template?: string;
      text_template?: string;
      token_id?: string;
      url?: string;
      user_key?: string;
      username?: string;
      workflow_id?: string;
    };
    type:
      | 'apimetrics_api'
      | 'apimetrics_token'
      | 'apimetrics_workflow'
      | 'big_panda'
      | 'darkspark'
      | 'datadog'
      | 'datadogevent'
      | 'email'
      | 'email_template'
      | 'email_text'
      | 'flowdock'
      | 'generic'
      | 'hipchat'
      | 'msteams'
      | 'newrelic'
      | 'opsgenie'
      | 'opsgenieeu'
      | 'pager_duty'
      | 'pager_duty_v2'
      | 'slack'
      | 'statuspage'
      | 'victorops';
  };
};
