// Lots of the request properties are not in camel case so to prevent
// hundreds of singular exceptions, just cover whole file
/* eslint-disable camelcase */
import {Flags} from '@oclif/core';
import {Command, T, util} from '../../base-command';

export type EditJSON = {
  success: boolean;
  webhook: T.Webhook;
};

export default class Edit extends Command<EditJSON> {
  static description = 'Edit a webhook.';

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {
    'webhook-id': Flags.string({description: 'Webhook to edit.', required: true}),
    name: Flags.string({description: 'Name of project.', char: 'n'}),
    'fails-in-a-row': Flags.integer({
      description:
        'Trigger webhook after this many successive failures. Used by all except apimetrics_token.',
      min: 0,
    }),
    'email-address': Flags.string({
      description: 'Your email address. Used by [email, email_text, email_template].',
    }),
    'subject-template': Flags.string({
      description: 'Template for subject line. Used by [email_template].',
      default: '[{{result_class}}]: APImetrics: {{ call_meta.name }}',
    }),
    'text-template': Flags.string({
      description: 'Template for email body. Used by [email_template].',
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
      description: 'URL for webhook to call. Used by [generic, slack, hipchat, msteams].',
    }),
    username: Flags.string({
      description: 'Username to use for authentication. Used by [generic].',
    }),
    password: Flags.string({
      description: 'Password to use for authentication. Used by [generic].',
    }),
    'call-id': Flags.string({
      description: 'APImetrics API call to run. Used by [apimetrics_api].',
    }),
    'workflow-id': Flags.string({
      description: 'APImetrics workflow to run. Used by [apimetrics_workflow].',
    }),
    'token-id': Flags.string({
      description: 'APImetrics token to update. Used by [apimetrics_token].',
    }),
    channel: Flags.string({
      description:
        'Integration channel name if different from that defined in the slack integration. ' +
        'Used by [slack].',
    }),
    'integration-key': Flags.string({
      description:
        'The service integration key with Integration Type: APImetrics. ' +
        'Used by [pager_duty, pager_duty_v2].',
    }),
    severity: Flags.string({
      description: 'Severity of alert. Used by [pager_duty_v2].',
      options: ['critical', 'error', 'warning', 'info'],
    }),
    'user-key': Flags.string({
      description: 'User key to use for authentication. Used by [big_panda].',
    }),
    'app-key': Flags.string({
      description: 'App key to use to identify this app. Used by [big_panda, newrelic].',
    }),
    'api-key': Flags.string({
      description:
        'API key to use for authentication. ' +
        'Used by: [victorops, newrelic, datadog, ' +
        'datadogevent, statuspage, opsgenie, opsgenieeu].',
    }),
    'routing-key': Flags.string({
      description: 'Routing key to route alert. Used by [victorops].',
    }),
    'page-id': Flags.string({
      description: 'Page ID for StatusPage. Used by [statuspage].',
    }),
    'component-id': Flags.string({
      description: 'StatusPage component ID. Used by [statuspage].',
    }),
    'flow-token': Flags.string({
      description: 'The token for the flow to post to. Used by [flowdock].',
    }),
    'add-alert': Flags.string({
      description: 'Add result type to fire webhook on.',
      multiple: true,
      options: ['PASS', 'SLOW', 'WARNING', 'FAIL'],
    }),
    'remove-alert': Flags.string({
      description: 'Remove result type to fire webhook on.',
      multiple: true,
      options: ['PASS', 'SLOW', 'WARNING', 'FAIL'],
    }),
    'add-include-tags': Flags.string({
      description: 'Add tag to included tags.',
      multiple: true,
    }),
    'remove-include-tags': Flags.string({
      description: 'Remove tag from included tags.',
      multiple: true,
    }),
    'add-exclude-tags': Flags.string({
      description: 'Add tag to excluded tags.',
      multiple: true,
    }),
    'remove-exclude-tags': Flags.string({
      description: 'Remove tag from excluded tags.',
      multiple: true,
    }),
    enable: Flags.boolean({
      description: 'Enable this webhook if it is not already enabled',
      exclusive: ['disable'],
    }),
    disable: Flags.boolean({
      description: 'Disable this webhook if not already disabled.',
      exclusive: ['enable'],
    }),
  };

  /**
   * Add and remove strings from current list
   * In cases where a string appears in both the add and remove list, it
   * will not be added and if already present will be removed.
   * @param current Current list
   * @param add Strings to add
   * @param remove Strings to remove
   * @returns Updated list
   */
  private addRemoveStrings(current: string[], add: string[], remove: string[]): string[] {
    for (const item of add) {
      if (!current.includes(item)) {
        current.push(item);
      }
    }

    current.filter((item) => !remove.includes(item));

    return current;
  }

  public async run(): Promise<EditJSON> {
    const {flags} = await this.parse(Edit);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const webhook = await this.api.get<T.Webhook>(`webhooks/${flags['webhook-id']}`);

    // API wants a string but we want number for easier validation
    const failsInRow =
      flags['fails-in-a-row']?.toString() || webhook.webhook.parameters.fails_in_a_row;

    let request: T.Webhook;
    const requestMeta: T.Webhook['meta'] = {
      name: flags.name || webhook.meta.name,
      include_tags: this.addRemoveStrings(
        webhook.meta.include_tags,
        flags['add-include-tags'] || [],
        flags['remove-include-tags'] || []
      ),
      exclude_tags: this.addRemoveStrings(
        webhook.meta.exclude_tags,
        flags['add-exclude-tags'] || [],
        flags['remove-exclude-tags'] || []
      ),
    };

    const enabled = flags.disable ? false : flags.enable || webhook.webhook.enabled;

    switch (webhook.webhook.type) {
      case 'email':
        if (flags['email-address'] && !util.validateEmail(flags['email-address']!)) {
          throw new Error(`${flags['email-address']} is not a valid email.`);
        }

        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'email',
            parameters: {
              email_address: flags['email-address'] || webhook.webhook.parameters.email_address,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'email_text':
        if (flags['email-address'] && !util.validateEmail(flags['email-address']!)) {
          throw new Error(`${flags['email-address']} is not a valid email.`);
        }

        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'email_text',
            parameters: {
              email_address: flags['email-address'] || webhook.webhook.parameters.email_address,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'email_template':
        if (flags['email-address'] && !util.validateEmail(flags['email-address']!)) {
          throw new Error(`${flags['email-address']} is not a valid email.`);
        }

        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'email_template',
            parameters: {
              email_address: flags['email-address'] || webhook.webhook.parameters.email_address,
              subject_template:
                flags['subject-template'] || webhook.webhook.parameters.subject_template,
              text_template: flags['text-template'] || webhook.webhook.parameters.text_template,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'generic':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'generic',
            parameters: {
              url: flags.url!.toString() || webhook.webhook.parameters.url,
              username: flags.username || webhook.webhook.parameters.username,
              password: flags.password || webhook.webhook.parameters.password,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'apimetrics_api':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'apimetrics_api',
            parameters: {
              call_id: flags['call-id'] || webhook.webhook.parameters.call_id,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'apimetrics_workflow':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'apimetrics_workflow',
            parameters: {
              workflow_id: flags['workflow-id'] || webhook.webhook.parameters.workflow_id,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'apimetrics_token':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'apimetrics_token',
            parameters: {
              token_id: flags['token-id'] || webhook.webhook.parameters.token_id,
            },
          },
        };
        break;
      case 'slack':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'slack',
            parameters: {
              url: flags.url!.toString() || webhook.webhook.parameters.url,
              channel: flags.channel || webhook.webhook.parameters.channel,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'pager_duty':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'pager_duty',
            parameters: {
              integration_key:
                flags['integration-key'] || webhook.webhook.parameters.integration_key,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'pager_duty_v2':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'pager_duty_v2',
            parameters: {
              integration_key:
                flags['integration-key'] || webhook.webhook.parameters.integration_key,
              severity:
                (flags.severity as 'critical' | 'error' | 'warning' | 'info') ||
                webhook.webhook.parameters.severity,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'big_panda':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'big_panda',
            parameters: {
              user_key: flags['user-key'] || webhook.webhook.parameters.user_key,
              app_key: flags['app-key'] || webhook.webhook.parameters.app_key,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'victorops':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'victorops',
            parameters: {
              api_key: flags['api-key'] || webhook.webhook.parameters.app_key,
              routing_key: flags['routing-key'] || webhook.webhook.parameters.routing_key,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'hipchat':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'hipchat',
            parameters: {
              url: flags.url!.toString() || webhook.webhook.parameters.url,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'msteams':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'msteams',
            parameters: {
              url: flags.url!.toString() || webhook.webhook.parameters.url,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'newrelic':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'newrelic',
            parameters: {
              app_key: flags['app-key'] || webhook.webhook.parameters.app_key,
              api_key: flags['api-key'] || webhook.webhook.parameters.api_key,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'darkspark':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
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
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'datadog',
            parameters: {
              api_key: flags['api-key'] || webhook.webhook.parameters.api_key,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'datadogevent':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'datadogevent',
            parameters: {
              api_key: flags['api-key'] || webhook.webhook.parameters.api_key,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'statuspage':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'statuspage',
            parameters: {
              page_id: flags['page-id'] || webhook.webhook.parameters.page_id,
              api_key: flags['api-key'] || webhook.webhook.parameters.api_key,
              component_id: flags['component-id'] || webhook.webhook.parameters.component_id,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'flowdock':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'flowdock',
            parameters: {
              flow_token: flags['flow-token'] || webhook.webhook.parameters.flow_token,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'opsgenie':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'opsgenie',
            parameters: {
              api_key: flags['api-key'] || webhook.webhook.parameters.api_key,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
      case 'opsgenieeu':
        request = {
          meta: requestMeta,
          webhook: {
            enabled: enabled,
            alerts: flags.alert as ('PASS' | 'SLOW' | 'WARNING' | 'FAIL')[],
            type: 'opsgenieeu',
            parameters: {
              api_key: flags['api-key'] || webhook.webhook.parameters.api_key,
              fails_in_a_row: failsInRow,
            },
          },
        };
        break;
    }

    const updatedWebhook = await this.api.post<T.Webhook>(`webhooks/${flags['webhook-id']}`, {
      body: JSON.stringify(request),
    });
    return {success: true, webhook: updatedWebhook};
  }
}
