import {Flags} from '@oclif/core';
import {Command, T} from '../../base-command';

export default class Create extends Command<T.Call> {
  static description = 'Create a new API call';
  protected projectOnly = true;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    name: Flags.string({description: 'Name of API call', char: 'n', required: true}),
    url: Flags.string({description: 'URL to call', char: 'u', required: true}),
    method: Flags.string({
      description: 'HTTP method to use',
      options: [
        'get',
        'GET',
        'head',
        'HEAD',
        'post',
        'POST',
        'put',
        'PUT',
        'patch',
        'PATCH',
        'delete',
        'DELETE',
        'options',
        'OPTIONS',
      ],
      char: 'm',
      default: 'GET',
    }),
  };

  public async run(): Promise<T.Call> {
    const {flags} = await this.parse(Create);
    const endpoint = `calls/`;
    const call = await this.api.post<T.Call>(
      endpoint,
      {
        body: JSON.stringify({
          meta: {name: flags.name},
          request: {method: flags.method, url: flags.url},
        }),
      },
      false
    );
    this.log(call.meta.project_id);
    return call;
  }
}
