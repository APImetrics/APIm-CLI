import {Flags, ux} from '@oclif/core';

import {Command, T} from '../../base-command';

export type WebhookList = {
  accounts: T.Webhook[];
  success: boolean;
};

export default class Webhooks extends Command<WebhookList> {
  static description = 'List all webhooks in a Project.';
  static examples = [
    `<%= config.bin %> <%= command.id %>
Name         Type      Enabled Include Tags Exclude Tags
──────────── ───────── ─────── ──────────── ────────────
Email        email     true    None         None
DataDoggg    datadog   false   None         None
Slack        slack     true    None         None
GEn          generic   false   None         None
`,
  ];

  static flags = {
    ...ux.table.flags(),
    'project-id': Flags.string({
      char: 'p',
      description:
        'ID of project to read. Overrides apimetrics config project set.' +
        ' Can be found in the Project Settings web page under the admin' +
        ' section or by using the command `apimetrics projects --columns name,id`.',
    }),
  };

  protected permitKeyAuth = true;

  public async run(): Promise<WebhookList> {
    const {flags} = await this.parse(Webhooks);
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const webhooks = await this.api.list<T.Webhook>('webhooks/');

    ux.table(
      webhooks,
      {
        enabled: {
          get: (row) => row.webhook.enabled,
        },
        excludeTags: {
          get: (row) => row.meta.exclude_tags.join(', ') || 'None',
          header: 'Exclude Tags',
        },
        id: {
          extended: true,
          get: (row) => row.id,
          header: 'ID',
        },
        includeTags: {
          get: (row) => row.meta.include_tags.join(', ') || 'None',
          header: 'Include Tags',
        },
        name: {
          get: (row) => row.meta.name,
        },
        owner: {
          extended: true,
          get: (row) => row.meta.owner,
        },
        parameters: {
          extended: true,
          get: (row) =>
            Object.entries(row.webhook.parameters)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', '),
        },
        tags: {
          extended: true,
          get: (row) => row.meta.tags?.join(', ') || 'None',
        },
        type: {
          get: (row) => row.webhook.type,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {accounts: webhooks, success: true};
  }
}
