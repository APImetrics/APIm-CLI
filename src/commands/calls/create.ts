import {Flags} from '@oclif/core';
import {Command, T, util} from '../../base-command';

export default class Create extends Command<T.Call> {
  static description = 'Create a new API call.';
  protected permitKeyAuth = true;

  static examples = [
    `<%= config.bin %> <%= command.id %> --name Apples --url https://example.com/v1/apples
ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9f3DuAoM`,
    `<%= config.bin %> <%= command.id %> --name Oranges --url https://example.com/v1/oranges --method POST --header "Content-Type: application/json" --body '{"quantity": 3}'
ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXRjklafJhslw62dahoM`,
  ];

  static flags = {
    name: Flags.string({description: 'Name of API call.', char: 'n', required: true}),
    url: Flags.string({description: 'URL to call.', char: 'u', required: true}),
    method: Flags.string({
      description: 'HTTP method to use.',
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
    tag: Flags.string({description: 'Tag to add to call.', multiple: true}),
    'project-id': Flags.string({
      description:
        'ID of project to modify. Overrides apimetrics config project set.' +
        ' Can be found in the Project Settings web page under the admin' +
        ' section or by using the command `apimetrics projects --columns name,id`.',
      char: 'p',
    }),
    description: Flags.string({description: 'Call description.'}),
    body: Flags.string({description: 'Request body.'}),
  };

  public async run(): Promise<T.Call> {
    const {flags} = await this.parse(Create);
    let headers: T.Call['request']['headers'] = [];

    if (flags.header && flags.header.length > 0) {
      for (const header of flags.header) {
        headers.push(util.parseHeader(header));
      }
    }

    // #105 If we don't pass a content type we default to
    // application/json. Prevents issues with web UI displaying body
    if (flags.body && !headers.some((val) => val.key.toLowerCase() === 'content-type')) {
      headers.push({key: 'Content-Type', value: 'application/json'});
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

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    const call = await this.api.post<T.Call>('calls/', {
      body: {
        meta: {name: flags.name, description: flags.description, tags: tags},
        request: {method: flags.method, url: flags.url, headers: headers, body: flags.body},
      },
    });
    this.log(call.id);
    return call;
  }
}
