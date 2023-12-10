import {Flags, ux} from '@oclif/core';

import {Command, T} from '../../base-command';

export type CallsList = {
  calls: T.Call[];
  success: boolean;
};

export default class Calls extends Command<CallsList> {
  static description = 'List API calls in project.';
  static examples = [
    `<%= config.bin %> <%= command.id %>
Name   Description Method  URL
────── ─────────── ─────── ─────────────────────────────
Apples null        GET     https://example.com/v1/apples`,
    `<%= config.bin %> <%= command.id %> --columns name,id
Name   ID
────── ────────────────────────────────────────────────────────
Apples ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9f3DuAoM `,
  ];

  static flags = {
    ...ux.table.flags(),
    'project-id': Flags.string({
      char: 'p',
      description: 'ID of project to read. Overrides apimetrics config project set.',
    }),
  };

  protected permitKeyAuth = true;

  public async run(): Promise<CallsList> {
    const {flags} = await this.parse(Calls);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const endpoint = `calls/`;
    const calls = await this.api.list<T.Call>(endpoint);

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
