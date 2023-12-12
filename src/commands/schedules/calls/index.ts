import {Flags, ux} from '@oclif/core';

import {Command, T} from '../../../base-command';

export type CallList = {
  calls: T.Call[];
  success: boolean;
};

export default class Calls extends Command<CallList> {
  static description = 'List calls on the schedule.';
  static examples = [
    `<%= config.bin %> <%= command.id %> --schedule-id ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Pbn4ZILDA
Name   Description Method URL
────── ─────────── ────── ──────────────────────────
Apples             GET    https://example.com/apples`,
  ];

  static flags = {
    ...ux.table.flags(),
    'project-id': Flags.string({
      char: 'p',
      description: 'ID of project to read. Overrides apimetrics config project set.',
    }),
    'schedule-id': Flags.string({
      char: 's',
      description: 'ID of schedule to read.',
      required: true,
    }),
  };

  protected permitKeyAuth = true;

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
        accept: {
          extended: true,
          get: (row) => row.meta.accept,
        },
        auth: {
          extended: true,
          get: (row) => row.request.auth_id,
        },
        description: {
          get: (row) => row.meta.description || '',
        },
        domain: {
          extended: true,
          get: (row) => row.meta.domain,
        },
        id: {
          extended: true,
          header: 'ID',
        },
        method: {
          get: (row) => row.request.method,
        },
        name: {
          get: (row) => row.meta.name,
        },
        tags: {
          extended: true,
          get: (row) => row.meta.tags.join(', '),
        },
        url: {
          get: (row) => row.request.url,
          header: 'URL',
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {calls, success: true};
  }
}
