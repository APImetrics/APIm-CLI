import {Flags} from '@oclif/core';
import {Command, T, util} from '../../base-command';
import * as inquirer from 'inquirer';

export default class Edit extends Command<T.Call> {
  static description = 'Edit an existing API call';
  protected permitKeyAuth = true;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    'call-id': Flags.string({description: 'ID of call', char: 'i'}),
    name: Flags.string({description: 'Name of API call', char: 'n'}),
    url: Flags.string({description: 'URL to call', char: 'u'}),
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
    }),
    accept: Flags.string({
      description: 'MIME type for accept header. Alias for --replace-header Accept: <MIME type>.',
    }),
    'add-header': Flags.string({
      description: 'Add header to the call. Specify in the form <key>: <value>.',
      multiple: true,
    }),
    'replace-header': Flags.string({
      description:
        'Add header to the call or replace if it already exists. Specify in the form <key>: <value>.',
      multiple: true,
    }),
    'remove-header': Flags.string({
      description: 'Name of header to remove.',
      multiple: true,
    }),
    'add-tag': Flags.string({
      description: 'Name of tag to add. No effect if the tag already exists.',
      multiple: true,
    }),
    'remove-tag': Flags.string({
      description: 'Name of tag to remove.',
      multiple: true,
    }),
    'project-id': Flags.string({
      description: 'ID of project to modify. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  private async getCall(): Promise<T.Call> {
    const callData = await this.api.get<T.ListResponse<T.Call>>('calls/');
    const calls: {name: string; value: string}[] = [];
    for (const call of callData.results) {
      calls.push({
        name: `${call.meta.name} (${call.id})`,
        value: call.id,
      });
    }

    const response = await inquirer.prompt([
      {
        name: 'call',
        message: 'Select call',
        type: 'list',
        choices: calls,
      },
    ]);
    const selectedCall = callData.results.find((call) => call.id === response.call);
    if (selectedCall) return selectedCall;
    throw new Error('Selected call does not exist');
  }

  public async run(): Promise<T.Call> {
    const {flags} = await this.parse(Edit);
    let endpoint: string;
    let call: T.Call;

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    if (flags.json && !flags['call-id']) {
      throw new Error('Must specify --call-id in non-interactive mode.');
    }

    if (flags['call-id']) {
      endpoint = `calls/${flags['call-id']}/`;
      call = await this.api.get<T.Call>(endpoint);
    } else {
      call = await this.getCall();
      endpoint = `calls/${call.id}/`;
    }

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

    const updatedCall = await this.api.post<T.Call>(
      endpoint,
      {
        body: JSON.stringify({
          meta: {
            name: flags.name || call.meta.name,
            description: flags.description || call.meta.description,
            tags: call.meta.tags,
          },
          request: {
            method: flags.method || call.request.method,
            url: flags.url || call.request.url,
            headers: call.request.headers,
          },
        }),
      },
      false
    );
    return updatedCall;
  }
}
