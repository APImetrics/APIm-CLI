/* eslint-disable camelcase */
export type Webhook = {
  meta: {
    name: string;
    created?: string;
    include_tags: string[];
    exclude_tags: string[];
    tags?: string[];
    call_id?: string;
    last_update?: string;
    project_webhook?: boolean;
    owner?: string;
    project_id?: string;
  };
  webhook: {
    enabled: boolean;
    alerts: ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[];
    type:
      | 'generic'
      | 'apimetrics_api'
      | 'apimetrics_workflow'
      | 'apimetrics_token'
      | 'email'
      | 'email_text'
      | 'email_template'
      | 'big_panda'
      | 'darkspark'
      | 'datadog'
      | 'datadogevent'
      | 'flowdock'
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
    parameters: {
      fails_in_a_row?: string;
      email_address?: string;
      subject_template?: string;
      text_template?: string;
      url?: string;
      username?: string;
      password?: string;
      call_id?: string;
      workflow_id?: string;
      token_id?: string;
      channel?: string;
      integration_key?: string;
      severity?: 'critical' | 'error' | 'warning' | 'info';
      user_key?: string;
      app_key?: string;
      api_key?: string;
      routing_key?: string;
      page_id?: string;
      component_id?: string;
      flow_token?: string;
    };
  };
  id?: string;
};
