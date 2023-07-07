import {Flags} from '@oclif/core';
import {Command, T, util} from '../../base-command';

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
    accept: Flags.string({
      description: 'MIME type for accept header. Alias for --header Accept: <MIME type>.',
    }),
    header: Flags.string({description: 'Header to add to call.', multiple: true}),
    tag: Flags.string({description: 'Tag to add to call', multiple: true}),
  };

  public async run(): Promise<T.Call> {
    const {flags} = await this.parse(Create);
    const endpoint = `calls/`;

    let headers: T.Call['request']['headers'] = [];

    if (flags.header && flags.header.length > 0) {
      for (const header of flags.header) {
        headers.push(util.parseHeader(header));
      }
    }

    if (flags.accept) {
      headers = util.replaceHeader(headers, 'Accept', flags.accept);
    }

    const tags: T.Call['meta']['tags'] = [];

    if (flags.tag && flags.tag.length > 0) {
      for (const tag of flags.tag) {
        if (!tags.includes(tag)) tags.push(tag);
      }
    }

    const call = await this.api.post<T.Call>(
      endpoint,
      {
        body: JSON.stringify({
          meta: {name: flags.name, tags: tags},
          request: {method: flags.method, url: flags.url, headers: headers},
        }),
      },
      false
    );
    this.log(call.id);
    return call;
  }
}
