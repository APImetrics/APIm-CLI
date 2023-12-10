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
  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {
    alert: Flags.string({
      description: 'Fire webhook on these result types.',
      multiple: true,
      options: ['PASS', 'SLOW', 'WARNING', 'FAIL'],
      required: true,
    }),
    'api-key': Flags.string({
      description:
        'API key to use for authentication. ' +
        'Used by: [victorops: required, newrelic: required, datadog: required, ' +
        'datadogevent: required, statuspage: required, opsgenie: required, opsgenieeu: required].',
    }),
    'app-key': Flags.string({
      description:
        'App key to use to identify this app. Used by [big_panda: required, newrelic: required].',
    }),
    'call-id': Flags.string({
      description: 'APImetrics API call to run. Used by [apimetrics_api: required].',
    }),
    channel: Flags.string({
      description:
        'Integration channel name if different from that defined in the slack integration. ' +
        'Used by [slack: optional].',
    }),
    'component-id': Flags.string({
      description: 'StatusPage component ID. Used by [statuspage: required].',
    }),
    'email-address': Flags.string({
      description:
        'Your email address. Used by [email: required, email_text: required, email_template: required].',
    }),
    'exclude-tags': Flags.string({
      description: 'Exclude calls with this tag.',
      multiple: true,
    }),
    'fails-in-a-row': Flags.integer({
      default: 0,
      description:
        'Trigger webhook after this many successive failures. Used by all except apimetrics_token.',
      min: 0,
    }),
    'flow-token': Flags.string({
      description: 'The token for the flow to post to. Used by [flowdock: required].',
    }),
    'include-tags': Flags.string({
      description: 'Include calls with this tag.',
      multiple: true,
    }),
    'integration-key': Flags.string({
      description:
        'The service integration key with Integration Type: APImetrics. ' +
        'Used by [pager_duty: required, pager_duty_v2: required].',
    }),
    name: Flags.string({char: 'n', description: 'Name of project.', required: true}),
    'page-id': Flags.string({
      description: 'Page ID for StatusPage. Used by [statuspage: required].',
    }),
    password: Flags.string({
      description: 'Password to use for authentication. Used by [generic: optional].',
    }),
    'project-id': Flags.string({
      char: 'p',
      description: 'ID of project to read. Overrides apimetrics config project set.',
    }),
    'routing-key': Flags.string({
      description: 'Routing key to route alert. Used by [victorops: optional].',
    }),
    severity: Flags.string({
      description: 'Severity of alert. Used by [pager_duty_v2: optional].',
      options: ['critical', 'error', 'warning', 'info'],
    }),
    'subject-template': Flags.string({
      default: '[{{result_class}}]: APImetrics: {{ call_meta.name }}',
      description: 'Template for subject line. Used by [email_template: required].',
    }),
    'text-template': Flags.string({
      default: `{{ result }}: HTTP {{ http_code }} {{ http_reason }}
Latency: {{ response_time }} ms
Size: {{ response_size }} bytes

Variables:
{% for key, value in context|dictsort -%}
- {{ key }}: {% if value is mapping %}...{% else %}{{ value }}{% endif %}
{% endfor -%}

Result: {{ result_url }}

      `,
      description: 'Template for email body. Used by [email_template: required].',
    }),
    'token-id': Flags.string({
      description: 'APImetrics token to update. Used by [apimetrics_token: required].',
    }),
    type: Flags.string({
      description: 'Type of webhook to create.',
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
          flags: [
            {
              name: 'email-address',
              when: async (flags) =>
                ['email', 'email_template', 'email_text'].includes(flags.type as string),
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
                ['generic', 'hipchat', 'msteams', 'slack'].includes(flags.type as string),
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
                  'datadog',
                  'datadogevent',
                  'newrelic',
                  'opsgenie',
                  'opsgenieeu',
                  'statuspage',
                  'victorops',
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
          type: 'all',
        },
      ],
      required: true,
    }),
    url: Flags.url({
      description:
        'URL for webhook to call. Used by [generic: required, slack: required, ' +
        'hipchat: required, msteams: required].',
    }),
    'user-key': Flags.string({
      description: 'User key to use for authentication. Used by [big_panda: required].',
    }),
    username: Flags.string({
      description: 'Username to use for authentication. Used by [generic: optional].',
    }),
    'workflow-id': Flags.string({
      description: 'APImetrics workflow to run. Used by [apimetrics_workflow: required].',
    }),
  };

  protected permitKeyAuth = true;

  public async run(): Promise<CreateJSON> {
    const {flags} = await this.parse(Create);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    // API wants a string but we want number for easier validation
    const failsInRow = flags['fails-in-a-row'].toString();

    let request: T.Webhook;
    const requestMeta: T.Webhook['meta'] = {
      exclude_tags: flags['exclude-tags'] || [],
      include_tags: flags['include-tags'] || [],
      name: flags.name,
    };
    switch (flags.type as T.Webhook['webhook']['type']) {
      case 'email': {
        if (!util.validateEmail(flags['email-address']!)) {
          throw new Error(`${flags['email-address']} is not a valid email.`);
        }

        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              email_address: flags['email-address'],
              fails_in_a_row: failsInRow,
            },
            type: 'email',
          },
        };
        break;
      }

      case 'email_text': {
        if (!util.validateEmail(flags['email-address']!)) {
          throw new Error(`${flags['email-address']} is not a valid email.`);
        }

        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              email_address: flags['email-address'],
              fails_in_a_row: failsInRow,
            },
            type: 'email_text',
          },
        };
        break;
      }

      case 'email_template': {
        if (!util.validateEmail(flags['email-address']!)) {
          throw new Error(`${flags['email-address']} is not a valid email.`);
        }

        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              email_address: flags['email-address'],
              fails_in_a_row: failsInRow,
              subject_template: flags['subject-template'],
              text_template: flags['text-template'],
            },
            type: 'email_template',
          },
        };
        break;
      }

      case 'generic': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              fails_in_a_row: failsInRow,
              password: flags.password,
              url: flags.url!.toString(),
              username: flags.username,
            },
            type: 'generic',
          },
        };
        break;
      }

      case 'apimetrics_api': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              call_id: flags['call-id'],
              fails_in_a_row: failsInRow,
            },
            type: 'apimetrics_api',
          },
        };
        break;
      }

      case 'apimetrics_workflow': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              fails_in_a_row: failsInRow,
              workflow_id: flags['workflow-id'],
            },
            type: 'apimetrics_workflow',
          },
        };
        break;
      }

      case 'apimetrics_token': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              token_id: flags['token-id'],
            },
            type: 'apimetrics_token',
          },
        };
        break;
      }

      case 'slack': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              channel: flags.channel,
              fails_in_a_row: failsInRow,
              url: flags.url!.toString(),
            },
            type: 'slack',
          },
        };
        break;
      }

      case 'pager_duty': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              fails_in_a_row: failsInRow,
              integration_key: flags['integration-key'],
            },
            type: 'pager_duty',
          },
        };
        break;
      }

      case 'pager_duty_v2': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              fails_in_a_row: failsInRow,
              integration_key: flags['integration-key'],
              severity: flags.severity as 'critical' | 'error' | 'info' | 'warning',
            },
            type: 'pager_duty_v2',
          },
        };
        break;
      }

      case 'big_panda': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              app_key: flags['app-key'],
              fails_in_a_row: failsInRow,
              user_key: flags['user-key'],
            },
            type: 'big_panda',
          },
        };
        break;
      }

      case 'victorops': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              api_key: flags['api-key'],
              fails_in_a_row: failsInRow,
              routing_key: flags['routing-key'],
            },
            type: 'victorops',
          },
        };
        break;
      }

      case 'hipchat': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              fails_in_a_row: failsInRow,
              url: flags.url!.toString(),
            },
            type: 'hipchat',
          },
        };
        break;
      }

      case 'msteams': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              fails_in_a_row: failsInRow,
              url: flags.url!.toString(),
            },
            type: 'msteams',
          },
        };
        break;
      }

      case 'newrelic': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              api_key: flags['api-key'],
              app_key: flags['app-key'],
              fails_in_a_row: failsInRow,
            },
            type: 'newrelic',
          },
        };
        break;
      }

      case 'darkspark': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {},
            type: 'darkspark',
          },
        };
        break;
      }

      case 'datadog': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              api_key: flags['api-key'],
              fails_in_a_row: failsInRow,
            },
            type: 'datadog',
          },
        };
        break;
      }

      case 'datadogevent': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              api_key: flags['api-key'],
              fails_in_a_row: failsInRow,
            },
            type: 'datadogevent',
          },
        };
        break;
      }

      case 'statuspage': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              api_key: flags['api-key'],
              component_id: flags['component-id'],
              fails_in_a_row: failsInRow,
              page_id: flags['page-id'],
            },
            type: 'statuspage',
          },
        };
        break;
      }

      case 'flowdock': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              fails_in_a_row: failsInRow,
              flow_token: flags['flow-token'],
            },
            type: 'flowdock',
          },
        };
        break;
      }

      case 'opsgenie': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              api_key: flags['api-key'],
              fails_in_a_row: failsInRow,
            },
            type: 'opsgenie',
          },
        };
        break;
      }

      case 'opsgenieeu': {
        request = {
          meta: requestMeta,
          webhook: {
            alerts: flags.alert as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[],
            enabled: true,
            parameters: {
              api_key: flags['api-key'],
              fails_in_a_row: failsInRow,
            },
            type: 'opsgenieeu',
          },
        };
        break;
      }
    }

    const webhook = await this.api.put<T.Webhook>('webhooks/', {body: request});
    this.log(webhook.id);
    return {success: true, webhook};
  }
}
