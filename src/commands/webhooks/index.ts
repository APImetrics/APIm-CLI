import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../base-command';

export type WebhookList = {
  success: boolean;
  accounts: T.Webhook[];
};

export default class Webhooks extends Command<WebhookList> {
  static description = 'List users with access to the project.';

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
      description: 'ID of project to read. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<WebhookList> {
    const {flags} = await this.parse(Webhooks);
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const webhooks = await this.api.list<T.Webhook>('webhooks/');

    ux.table(
      webhooks,
      {
        name: {
          get: (row) => row.meta.name,
        },
        type: {
          get: (row) => row.webhook.type,
        },
        enabled: {
          get: (row) => row.webhook.enabled,
        },
        includeTags: {
          header: 'Include Tags',
          get: (row) => row.meta.include_tags.join(', ') || 'None',
        },
        excludeTags: {
          header: 'Exclude Tags',
          get: (row) => row.meta.exclude_tags.join(', ') || 'None',
        },
        id: {
          header: 'ID',
          get: (row) => row.id,
          extended: true,
        },
        owner: {
          get: (row) => row.meta.owner,
          extended: true,
        },
        parameters: {
          get: (row) =>
            Object.entries(row.webhook.parameters)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', '),
          extended: true,
        },
        tags: {
          get: (row) => row.meta.tags?.join(', ') || 'None',
          extended: true,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, accounts: webhooks};
  }
}
