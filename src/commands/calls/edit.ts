import {Flags} from '@oclif/core';

import {Command, T, util} from '../../base-command';

export type UpdatedCall = {
  call: T.Call;
  success: boolean;
};

export default class Edit extends Command<UpdatedCall> {
  static description = 'Edit an existing API call.';
  static examples = [
    '<%= config.bin %> <%= command.id %> --call-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9f3DuAoM --url https://example.com/v2/apples',
  ];

  static flags = {
    accept: Flags.string({
      description: 'MIME type for accept header. Alias for --replace-header Accept: <MIME type>.',
    }),
    'add-header': Flags.string({
      description: 'Add header to the call. Specify in the form <key>: <value>.',
      multiple: true,
    }),
    'add-tag': Flags.string({
      description: 'Name of tag to add. No effect if the tag already exists.',
      multiple: true,
    }),
    body: Flags.string({description: 'Request body.'}),
    'call-id': Flags.string({char: 'c', description: 'ID of call.', required: true}),
    description: Flags.string({description: 'Call description.'}),
    method: Flags.string({
      char: 'm',
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
    }),
    name: Flags.string({char: 'n', description: 'Name of API call.'}),
    'remove-header': Flags.string({
      description: 'Name of header to remove.',
      multiple: true,
    }),
    'remove-tag': Flags.string({
      description: 'Name of tag to remove.',
      multiple: true,
    }),
    'replace-header': Flags.string({
      description:
        'Add header to the call or replace if it already exists. Specify in the form <key>: <value>.',
      multiple: true,
    }),
    url: Flags.string({char: 'u', description: 'URL to call.'}),
  };

  protected permitKeyAuth = true;

  public async run(): Promise<UpdatedCall> {
    const {flags} = await this.parse(Edit);

    const endpoint = `calls/${flags['call-id']}/`;
    const call = await this.api.get<T.Call>(endpoint);

    if (flags['remove-header'] && flags['remove-header'].length > 0) {
      for (const header of flags['remove-header']) {
        call.request.headers = util.deleteHeader(call.request.headers, header);
      }
    }

    if (flags['replace-header'] && flags['replace-header'].length > 0) {
      for (const header of flags['replace-header']) {
        const {key, value} = util.parseHeader(header);
        call.request.headers = util.replaceHeader(call.request.headers, key, value);
      }
    }

    if (flags['add-header'] && flags['add-header'].length > 0) {
      for (const header of flags['add-header']) {
        call.request.headers.push(util.parseHeader(header));
      }
    }

    // #105 If we don't pass a content type we default to
    // application/json. Prevents issues with web UI displaying body
    if (
      flags.body &&
      !call.request.headers.some((val) => val.key.toLowerCase() === 'content-type')
    ) {
      call.request.headers.push({key: 'Content-Type', value: 'application/json'});
    }

    if (flags.accept) {
      call.request.headers = util.replaceHeader(call.request.headers, 'Accept', flags.accept);
    }

    if (flags['remove-tag'] && flags['remove-tag'].length > 0) {
      call.meta.tags = call.meta.tags.filter((tag) => !flags['remove-tag']?.includes(tag));
    }

    if (flags['add-tag'] && flags['add-tag'].length > 0) {
      for (const tag of flags['add-tag']) {
        if (!call.meta.tags.includes(tag)) call.meta.tags.push(tag);
      }
    }

    const updatedCall = await this.api.post<T.Call>(endpoint, {
      body: {
        meta: {
          description: flags.description || call.meta.description,
          name: flags.name || call.meta.name,
          tags: call.meta.tags,
        },
        request: {
          body: flags.body || call.request.body,
          headers: call.request.headers,
          method: flags.method || call.request.method,
          url: flags.url || call.request.url,
        },
      },
    });
    return {call: updatedCall, success: true};
  }
}
