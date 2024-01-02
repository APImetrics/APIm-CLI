import {Flags} from '@oclif/core';

import {Command} from '../../base-command';
export default class Delete extends Command<{success: boolean}> {
  static description = 'Delete a webhook.';
  static examples = [
    '<%= config.bin %> <%= command.id %> --webhook-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA',
  ];

  static flags = {
    'project-id': Flags.string({
      char: 'p',
      description:
        'ID of project to modify. Overrides apimetrics config project set.' +
        ' Can be found in the Project Settings web page under the admin' +
        ' section or by using the command `apimetrics projects --columns name,id`.',
    }),
    'webhook-id': Flags.string({
      description:
        'Webhook to delete. Can be found using the command' +
        ' `apimetrics webhooks --columns name,id`.',
      required: true,
    }),
  };

  protected permitKeyAuth = true;

  public async run(): Promise<{success: boolean}> {
    const {flags} = await this.parse(Delete);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    await this.api.delete(`webhooks/${flags['webhook-id']}`);
    return {success: true};
  }
}
