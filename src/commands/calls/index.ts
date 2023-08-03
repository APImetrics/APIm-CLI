import {Flags, ux} from '@oclif/core';
import {Command, T} from '../../base-command';

export type CallsList = {
  success: boolean;
  calls: T.Call[];
};

export default class Calls extends Command<CallsList> {
  static description = 'List API calls in project.';
  protected permitKeyAuth = true;

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
      description: 'ID of project to read. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

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
