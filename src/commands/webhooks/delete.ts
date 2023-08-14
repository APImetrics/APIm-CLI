import {Flags} from '@oclif/core';
import {Command} from '../../base-command';
export default class Delete extends Command<{success: boolean}> {
  static description = 'Delete an invite to the project.';

  static examples = [
    '<%= config.bin %> <%= command.id %> --webhook-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA',
  ];

  static flags = {
    'webhook-id': Flags.string({description: 'Webhook to delete.', required: true}),
    'project-id': Flags.string({
      description: 'ID of project to modify. Overrides apimetrics config project set.',
      char: 'p',
    }),
  };

  public async run(): Promise<{success: boolean}> {
    const {flags} = await this.parse(Delete);

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    await this.api.delete(`webhooks/${flags['webhook-id']}`);
    return {success: true};
  }
}
