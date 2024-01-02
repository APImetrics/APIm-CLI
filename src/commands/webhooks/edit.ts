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
    'add-alert': Flags.string({
      description: 'Add result type to fire webhook on.',
      multiple: true,
      options: ['PASS', 'SLOW', 'WARNING', 'FAIL'],
    }),
    'add-exclude-tags': Flags.string({
      description: 'Add tag to excluded tags.',
      multiple: true,
    }),
    'add-include-tags': Flags.string({
      description: 'Add tag to included tags.',
      multiple: true,
    }),
    'api-key': Flags.string({
      description:
        'API key to use for authentication. ' +
        'Used by: [victorops, newrelic, datadog, ' +
        'datadogevent, statuspage, opsgenie, opsgenieeu].',
    }),
    'app-key': Flags.string({
      description: 'App key to use to identify this app. Used by [big_panda, newrelic].',
    }),
    'call-id': Flags.string({
      description:
        'APImetrics API call to run. Can be found in the expanded Audit Logs of the desired' +
        ' API call in the Audit tab web page or by using the command' +
        ' `apimetrics calls --columns name,id`. Used by [apimetrics_api: required].',
    }),
    channel: Flags.string({
      description:
        'Integration channel name if different from that defined in the slack integration. ' +
        'Used by [slack].',
    }),
    'component-id': Flags.string({
      description: 'StatusPage component ID. Used by [statuspage].',
    }),
    disable: Flags.boolean({
      description: 'Disable this webhook if not already disabled.',
      exclusive: ['enable'],
    }),
    'email-address': Flags.string({
      description: 'Your email address. Used by [email, email_text, email_template].',
    }),
    enable: Flags.boolean({
      description: 'Enable this webhook if it is not already enabled',
      exclusive: ['disable'],
    }),
    'fails-in-a-row': Flags.integer({
      description:
        'Trigger webhook after this many successive failures. Used by all except apimetrics_token.',
      min: 0,
    }),
    'flow-token': Flags.string({
      description: 'The token for the flow to post to. Used by [flowdock].',
    }),
    'integration-key': Flags.string({
      description:
        'The service integration key with Integration Type: APImetrics. ' +
        'Used by [pager_duty, pager_duty_v2].',
    }),
    name: Flags.string({char: 'n', description: 'Name of project.'}),
    'page-id': Flags.string({
      description: 'Page ID for StatusPage. Used by [statuspage].',
    }),
    password: Flags.string({
      description: 'Password to use for authentication. Used by [generic].',
    }),
    'project-id': Flags.string({
      char: 'p',
      description:
        'ID of project to modify. Overrides apimetrics config project set.' +
        ' Can be found in the Project Settings web page under the admin' +
        ' section or by using the command `apimetrics projects --columns name,id`.',
    }),
    'remove-alert': Flags.string({
      description: 'Remove result type to fire webhook on.',
      multiple: true,
      options: ['PASS', 'SLOW', 'WARNING', 'FAIL'],
    }),
    'remove-exclude-tags': Flags.string({
      description: 'Remove tag from excluded tags.',
      multiple: true,
    }),
    'remove-include-tags': Flags.string({
      description: 'Remove tag from included tags.',
      multiple: true,
    }),
    'routing-key': Flags.string({
      description: 'Routing key to route alert. Used by [victorops].',
    }),
    severity: Flags.string({
      description: 'Severity of alert. Used by [pager_duty_v2].',
      options: ['critical', 'error', 'warning', 'info'],
    }),
    'subject-template': Flags.string({
      default: '[{{result_class}}]: APImetrics: {{ call_meta.name }}',
      description: 'Template for subject line. Used by [email_template].',
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
      description: 'Template for email body. Used by [email_template].',
    }),
    'token-id': Flags.string({
      description:
        'ID of project to modify. Overrides apimetrics config project set.' +
        ' Can be found in the Project Settings web page under the admin' +
        ' section or by using the command `apimetrics projects --columns name,id`.',
    }),
    url: Flags.url({
      description: 'URL for webhook to call. Used by [generic, slack, hipchat, msteams].',
    }),
    'user-key': Flags.string({
      description: 'User key to use for authentication. Used by [big_panda].',
    }),
    username: Flags.string({
      description: 'Username to use for authentication. Used by [generic].',
    }),
    'webhook-id': Flags.string({
      description:
        'Webhook to edit. Can be found using the command' +
        ' `apimetrics webhooks --columns name,id`.',
      required: true,
    }),
    'workflow-id': Flags.string({
      description:
        'APImetrics workflow to run. Can be found by using the command' +
        ' `apimetrics workflows --columns name,id`. Used by [apimetrics_workflow: required].',
    }),
  };

  protected permitKeyAuth = true;

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
      exclude_tags: this.addRemoveStrings(
        webhook.meta.exclude_tags,
        flags['add-exclude-tags'] || [],
        flags['remove-exclude-tags'] || []
      ),
      include_tags: this.addRemoveStrings(
        webhook.meta.include_tags,
        flags['add-include-tags'] || [],
        flags['remove-include-tags'] || []
      ),
      name: flags.name || webhook.meta.name,
    };

    const enabled = flags.disable ? false : flags.enable || webhook.webhook.enabled;

    const alerts = this.addRemoveStrings(
      webhook.webhook.alerts,
      flags['add-alert'] || [],
      flags['remove-alert'] || []
    ) as ('FAIL' | 'PASS' | 'SLOW' | 'WARNING')[];

    switch (webhook.webhook.type) {
      case 'email': {
        if (flags['email-address'] && !util.validateEmail(flags['email-address']!)) {
          throw new Error(`${flags['email-address']} is not a valid email.`);
        }

        request = {
          meta: requestMeta,
          webhook: {
            alerts,
            enabled,
            parameters: {
              email_address: flags['email-address'] || webhook.webhook.parameters.email_address,
              fails_in_a_row: failsInRow,
            },
            type: 'email',
          },
        };
        break;
      }

      case 'email_text': {
        if (flags['email-address'] && !util.validateEmail(flags['email-address']!)) {
          throw new Error(`${flags['email-address']} is not a valid email.`);
        }

        request = {
          meta: requestMeta,
          webhook: {
            alerts,
            enabled,
            parameters: {
              email_address: flags['email-address'] || webhook.webhook.parameters.email_address,
              fails_in_a_row: failsInRow,
            },
            type: 'email_text',
          },
        };
        break;
      }

      case 'email_template': {
        if (flags['email-address'] && !util.validateEmail(flags['email-address']!)) {
          throw new Error(`${flags['email-address']} is not a valid email.`);
        }

        request = {
          meta: requestMeta,
          webhook: {
            alerts,
            enabled,
            parameters: {
              email_address: flags['email-address'] || webhook.webhook.parameters.email_address,
              fails_in_a_row: failsInRow,
              subject_template:
                flags['subject-template'] || webhook.webhook.parameters.subject_template,
              text_template: flags['text-template'] || webhook.webhook.parameters.text_template,
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
            alerts,
            enabled,
            parameters: {
              fails_in_a_row: failsInRow,
              password: flags.password || webhook.webhook.parameters.password,
              url: flags.url!.toString() || webhook.webhook.parameters.url,
              username: flags.username || webhook.webhook.parameters.username,
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
            alerts,
            enabled,
            parameters: {
              call_id: flags['call-id'] || webhook.webhook.parameters.call_id,
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
            alerts,
            enabled,
            parameters: {
              fails_in_a_row: failsInRow,
              workflow_id: flags['workflow-id'] || webhook.webhook.parameters.workflow_id,
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
            alerts,
            enabled,
            parameters: {
              token_id: flags['token-id'] || webhook.webhook.parameters.token_id,
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
            alerts,
            enabled,
            parameters: {
              channel: flags.channel || webhook.webhook.parameters.channel,
              fails_in_a_row: failsInRow,
              url: flags.url!.toString() || webhook.webhook.parameters.url,
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
            alerts,
            enabled,
            parameters: {
              fails_in_a_row: failsInRow,
              integration_key:
                flags['integration-key'] || webhook.webhook.parameters.integration_key,
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
            alerts,
            enabled,
            parameters: {
              fails_in_a_row: failsInRow,
              integration_key:
                flags['integration-key'] || webhook.webhook.parameters.integration_key,
              severity:
                (flags.severity as 'critical' | 'error' | 'info' | 'warning') ||
                webhook.webhook.parameters.severity,
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
            alerts,
            enabled,
            parameters: {
              app_key: flags['app-key'] || webhook.webhook.parameters.app_key,
              fails_in_a_row: failsInRow,
              user_key: flags['user-key'] || webhook.webhook.parameters.user_key,
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
            alerts,
            enabled,
            parameters: {
              api_key: flags['api-key'] || webhook.webhook.parameters.app_key,
              fails_in_a_row: failsInRow,
              routing_key: flags['routing-key'] || webhook.webhook.parameters.routing_key,
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
            alerts,
            enabled,
            parameters: {
              fails_in_a_row: failsInRow,
              url: flags.url!.toString() || webhook.webhook.parameters.url,
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
            alerts,
            enabled,
            parameters: {
              fails_in_a_row: failsInRow,
              url: flags.url!.toString() || webhook.webhook.parameters.url,
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
            alerts,
            enabled,
            parameters: {
              api_key: flags['api-key'] || webhook.webhook.parameters.api_key,
              app_key: flags['app-key'] || webhook.webhook.parameters.app_key,
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
            alerts,
            enabled,
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
            alerts,
            enabled,
            parameters: {
              api_key: flags['api-key'] || webhook.webhook.parameters.api_key,
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
            alerts,
            enabled,
            parameters: {
              api_key: flags['api-key'] || webhook.webhook.parameters.api_key,
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
            alerts,
            enabled,
            parameters: {
              api_key: flags['api-key'] || webhook.webhook.parameters.api_key,
              component_id: flags['component-id'] || webhook.webhook.parameters.component_id,
              fails_in_a_row: failsInRow,
              page_id: flags['page-id'] || webhook.webhook.parameters.page_id,
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
            alerts,
            enabled,
            parameters: {
              fails_in_a_row: failsInRow,
              flow_token: flags['flow-token'] || webhook.webhook.parameters.flow_token,
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
            alerts,
            enabled,
            parameters: {
              api_key: flags['api-key'] || webhook.webhook.parameters.api_key,
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
            alerts,
            enabled,
            parameters: {
              api_key: flags['api-key'] || webhook.webhook.parameters.api_key,
              fails_in_a_row: failsInRow,
            },
            type: 'opsgenieeu',
          },
        };
        break;
      }
    }

    const updatedWebhook = await this.api.post<T.Webhook>(`webhooks/${flags['webhook-id']}`, {
      body: request,
    });
    return {success: true, webhook: updatedWebhook};
  }

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

    current = current.filter((item) => !remove.includes(item));

    return current;
  }
}
