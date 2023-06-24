import {ux} from '@oclif/core';
import {Command} from '../../base-command';
import {Call} from '../../api-responses';

export type CallsList = {
  success: boolean;
  calls: Call[];
};

export default class Calls extends Command<CallsList> {
  static description = 'List all API calls';
  protected projectOnly = true;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    ...ux.table.flags(),
  };

  public async run(): Promise<CallsList> {
    const {flags} = await this.parse(Calls);
    const endpoint = `calls/`;
    const {results: calls} = await this.api.get<{meta: any; results: Call[]}>(
      endpoint,
      undefined,
      false
    );

    ux.table(
      calls,
      {
        name: {
          get: (row) => row.meta.name,
        },
        description: {
          get: (row) => row.meta.description,
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
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, calls: calls};
  }
}
