// Lots of the request properties are not in camel case so to prevent
// hundreds of singular exceptions, just cover whole file
/* eslint-disable camelcase */
import {Flags} from '@oclif/core';
import {Command, T, util} from '../../base-command';

export type CreateJSON = {
  success: boolean;
  webhook: T.Webhook;
};

export default class Create extends Command<CreateJSON> {
  static description = 'Create a new webhook.';
  protected permitKeyAuth = true;

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {
    name: Flags.string({description: 'Name of project.', char: 'n', required: true}),
    type: Flags.string({
      description: 'Type of webhook to create.',
      required: true,
      options: [
        'generic',
        'apimetrics_api',
        'apimetrics_workflow',
        'apimetrics_token',
        'email',
        'email_text',
        'email_template',
        'big_panda',
        'darkspark',
        'datadog',
        'datadogevent',
        'flowdock',
        'hipchat',
        'msteams',
        'newrelic',
        'opsgenie',
        'opsgenieeu',
        'pager_duty',
        'pager_duty_v2',
        'slack',
        'statuspage',
        'victorops',
      ],
      relationships: [
        {
          type: 'all',
          flags: [
            {
              name: 'email-address',
              when: async (flags) =>
                ['email', 'email_text', 'email_template'].includes(flags.type as string),
            },
            {
              name: 'subject-template',
              when: async (flags) => ['email_template'].includes(flags.type as string),
            },
            {
              name: 'text-template',
              when: async (flags) => ['email_template'].includes(flags.type as string),
            },
            {
              name: 'url',
              when: async (flags) =>
                ['generic', 'slack', 'hipchat', 'msteams'].includes(flags.type as string),
            },
            {
              name: 'call-id',
              when: async (flags) => ['apimetrics_api'].includes(flags.type as string),
            },
            {
              name: 'workflow-id',
              when: async (flags) => ['apimetrics_workflow'].includes(flags.type as string),
            },
            {
              name: 'token-id',
              when: async (flags) => ['apimetrics_token'].includes(flags.type as string),
            },
            {
              name: 'integration-key',
              when: async (flags) => ['pager_duty', 'pager_duty_v2'].includes(flags.type as string),
            },
            {
              name: 'user-key',
              when: async (flags) => ['big_panda'].includes(flags.type as string),
            },
            {
              name: 'app-key',
              when: async (flags) => ['big_panda', 'newrelic'].includes(flags.type as string),
            },
            {
              name: 'api-key',
              when: async (flags) =>
                [
                  'victorops',
                  'newrelic',
                  'datadog',
                  'datadogevent',
                  'statuspage',
                  'opsgenie',
                  'opsgenieeu',
                ].includes(flags.type as string),
            },
            {
              name: 'page-id',
              when: async (flags) => ['statuspage'].includes(flags.type as string),
            },
            {
              name: 'component-id',
              when: async (flags) => ['statuspage'].includes(flags.type as string),
            },
            {
              name: 'flow-token',
              when: async (flags) => ['flowdock'].includes(flags.type as string),
            },
          ],
        },
      ],
    }),
    'fails-in-a-row': Flags.integer({
      description:
        'Trigger webhook after this many successive failures. Used by all except apimetrics_token.',
      min: 0,
      default: 0,
    }),
    'email-address': Flags.string({
      description:
        'Your email address. Used by [email: required, email_text: required, email_template: required].',
    }),
    'subject-template': Flags.string({
      description: 'Template for subject line. Used by [email_template: required].',
      default: '[{{result_class}}]: APImetrics: {{ call_meta.name }}',
    }),
    'text-template': Flags.string({
      description: 'Template for email body. Used by [email_template: required].',
      default: `{{ result }}: HTTP {{ http_code }} {{ http_reason }}
Latency: {{ response_time }} ms
Size: {{ response_size }} bytes

Variables:
{% for key, value in context|dictsort -%}
- {{ key }}: {% if value is mapping %}...{% else %}{{ value }}{% endif %}
{% endfor -%}

Result: {{ result_url }}

      `,
    }),
    url: Flags.url({
      description:
        'URL for webhook to call. Used by [generic: required, slack: required, ' +
        'hipchat: required, msteams: required].',
    }),
    username: Flags.string({
      description: 'Username to use for authentication. Used by [generic: optional].',
    }),
    password: Flags.string({
      description: 'Password to use for authentication. Used by [generic: optional].',
    }),
    'call-id': Flags.string({
      description: 'APImetrics API call to run. Used by [apimetrics_api: required].',
    }),
    'workflow-id': Flags.string({
      description: 'APImetrics workflow to run. Used by [apimetrics_workflow: required].',
    }),
    'token-id': Flags.string({
      description: 'APImetrics token to update. Used by [apimetrics_token: required].',
    }),
    channel: Flags.string({
      description:
        'Integration channel name if different from that defined in the slack integration. ' +
        'Used by [slack: optional].',
    }),
    'integration-key': Flags.string({
      description:
        'The service integration key with Integration Type: APImetrics. ' +
        'Used by [pager_duty: required, pager_duty_v2: required].',
    }),
    severity: Flags.string({
      description: 'Severity of alert. Used by [pager_duty_v2: optional].',
      options: ['critical', 'error', 'warning', 'info'],
    }),
    'user-key': Flags.string({
      description: 'User key to use for authentication. Used by [big_panda: required].',
    }),
    'app-key': Flags.string({
      description:
        'App key to use to identify this app. Used by [big_panda: required, newrelic: required].',
    }),
    'api-key': Flags.string({
      description:
        'API key to use for authentication. ' +
        'Used by: [victorops: required, newrelic: required, datadog: required, ' +
        'datadogevent: required, statuspage: required, opsgenie: required, opsgenieeu: required].',
    }),
    'routing-key': Flags.string({
      description: 'Routing key to route alert. Used by [victorops: optional].',
    }),
    'page-id': Flags.string({
      description: 'Page ID for StatusPage. Used by [statuspage: required].',
    }),
    'component-id': Flags.string({
      description: 'StatusPage component ID. Used by [statuspage: required].',
    }),
    'flow-token': Flags.string({
      description: 'The token for the flow to post to. Used by [flowdock: required].',
    }),
    alert: Flags.string({
      description: 'Fire webhook on these result types.',
      required: true,
      multiple: true,
      options: ['PASS', 'SLOW', 'WARNING', 'FAIL'],
    }),
    'include-tags': Flags.string({
      description: 'Include calls with this tag.',
      multiple: true,
    }),
    'exclude-tags': Flags.string({
      description: 'Exclude calls with this tag.',
      multiple: true,
    }),
    'project-id': Flags.string({
      description: 'ID of project to read. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<CreateJSON> {
    const {flags} = await this.parse(Create);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    // API wants a string but we want number for easier validation
    const failsInRow = flags['fails-in-a-row'].toString();

    let request: T.Webhook;
    const requestMeta: T.Webhook['meta'] = {
      name: flags.name,
      include_tags: flags['include-tags'] || [],
      exclude_tags: flags['exclude-tags'] || [],
    };
    switch (flags.type) {
      case 'email':
        if (!util.validateEmail(flags['email-address']!)) {
          throw new Error(`${flags['email-address']} is not a valid email.`);
        }

        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'email',
            parameters: {
              email_address: flags['email-address'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'email_text':
        if (!util.validateEmail(flags['email-address']!)) {
          throw new Error(`${flags['email-address']} is not a valid email.`);
        }

        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'email_text',
            parameters: {
              email_address: flags['email-address'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'email_template':
        if (!util.validateEmail(flags['email-address']!)) {
          throw new Error(`${flags['email-address']} is not a valid email.`);
        }

        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'email_template',
            parameters: {
              email_address: flags['email-address'],
              subject_template: flags['subject-template'],
              text_template: flags['text-template'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'generic':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'generic',
            parameters: {
              url: flags.url!.toString(),
              username: flags.username,
              password: flags.password,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'apimetrics_api':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'apimetrics_api',
            parameters: {
              call_id: flags['call-id'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'apimetrics_workflow':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'apimetrics_workflow',
            parameters: {
              workflow_id: flags['workflow-id'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'apimetrics_token':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'apimetrics_token',
            parameters: {
              token_id: flags['token-id'],
            },
          },
        };
        break;
      case 'slack':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'slack',
            parameters: {
              url: flags.url!.toString(),
              channel: flags.channel,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'pager_duty':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'pager_duty',
            parameters: {
              integration_key: flags['integration-key'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'pager_duty_v2':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'pager_duty_v2',
            parameters: {
              integration_key: flags['integration-key'],
              severity: flags.severity as 'critical' | 'error' | 'warning' | 'info',
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'big_panda':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'big_panda',
            parameters: {
              user_key: flags['user-key'],
              app_key: flags['app-key'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'victorops':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'victorops',
            parameters: {
              api_key: flags['api-key'],
              routing_key: flags['routing-key'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'hipchat':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'hipchat',
            parameters: {
              url: flags.url!.toString(),
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'msteams':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'msteams',
            parameters: {
              url: flags.url!.toString(),
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'newrelic':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'newrelic',
            parameters: {
              app_key: flags['app-key'],
              api_key: flags['api-key'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'darkspark':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'darkspark',
            parameters: {},
          },
        };
        break;
      case 'datadog':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'datadog',
            parameters: {
              api_key: flags['api-key'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'datadogevent':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'datadogevent',
            parameters: {
              api_key: flags['api-key'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'statuspage':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'statuspage',
            parameters: {
              page_id: flags['page-id'],
              api_key: flags['api-key'],
              component_id: flags['component-id'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'flowdock':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'flowdock',
            parameters: {
              flow_token: flags['flow-token'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'opsgenie':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'opsgenie',
            parameters: {
              api_key: flags['api-key'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'opsgenieeu':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: true,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'opsgenieeu',
            parameters: {
              api_key: flags['api-key'],
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      default:
        throw new Error('Unknown webhook type');
    }

    const webhook = await this.api.put<T.Webhook>('webhooks/', {body: JSON.stringify(request)});
    this.log(webhook.id);
    return {success: true, webhook: webhook};
  }
}
