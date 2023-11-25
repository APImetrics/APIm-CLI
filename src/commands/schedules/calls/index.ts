import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../../base-command/index.js';

export type CallList = {
  success: boolean;
  calls: T.Call[];
};

export default class Calls extends Command<CallList> {
  static description = 'List calls on the schedule.';
  protected permitKeyAuth = true;

  static examples = [
    `<%= config.bin %> <%= command.id %> --schedule-id ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Pbn4ZILDA
Name   Description Method URL
────── ─────────── ────── ──────────────────────────
Apples             GET    https://example.com/apples`,
  ];

  static flags = {
    ...ux.table.flags(),
    'project-id': Flags.string({
      description: 'ID of project to read. Overrides apimetrics config project set.',
      char: 'p',
    }),
    'schedule-id': Flags.string({
      description: 'ID of schedule to read.',
      char: 's',
      required: true,
    }),
  };

  public async run(): Promise<CallList> {
    const {flags} = await this.parse(Calls);
    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const schedule = await this.api.get<T.Schedule>(`schedules/${flags['schedule-id']}/`);
    const results = [];
    for (const target of schedule.schedule.target_ids) {
      results.push(this.api.get<T.Call>(`calls/${target}/`));
    }

    const calls = await Promise.all(results);

    ux.table(
      calls,
      {
        name: {
          get: (row) => row.meta.name,
        },
        description: {
          get: (row) => row.meta.description || '',
        },
        method: {
          get: (row) => row.request.method,
        },
        url: {
          header: 'URL',
          get: (row) => row.request.url,
        },
        id: {
          header: 'ID',
          extended: true,
        },
        tags: {
          get: (row) => row.meta.tags.join(', '),
          extended: true,
        },
        domain: {
          get: (row) => row.meta.domain,
          extended: true,
        },
        auth: {
          get: (row) => row.request.auth_id,
          extended: true,
        },
        accept: {
          get: (row) => row.meta.accept,
          extended: true,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, calls: calls};
  }
}
