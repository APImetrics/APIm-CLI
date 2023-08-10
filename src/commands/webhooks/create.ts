import {Flags} from '@oclif/core';
import {Command, T} from '../../base-command';

export type CreateJSON = {
  success: boolean;
  webhook?: T.Webhook;
};

export default class Create extends Command<CreateJSON> {
  static description = 'Create a new webhook.';

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

    return {success: true};
  }
}
