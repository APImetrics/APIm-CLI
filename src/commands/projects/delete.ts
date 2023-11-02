import {Flags} from '@oclif/core';
import {Command, T} from '../../base-command';

export default class Delete extends Command<{success: boolean}> {
  static description = 'Delete the currently selected project or specify another to delete.';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --project-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA',
  ];

  static flags = {
    'project-id': Flags.string({
      description: 'ID of project to delete. Overrides apimetrics config project set.',
      char: 'p',
    }),
    'org-id': Flags.string({
      description: 'ID of organization to modify. Overrides apimetrics config org set.',
      char: 'o',
    }),
  };

  public async run(): Promise<{success: boolean}> {
    const {flags} = await this.parse(Delete);

    const orgId = flags['org-id'] ? flags['org-id'] : this.userConfig.organization.current;
    if (orgId === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (orgId === '') {
      throw new Error('Personal projects not currently supported.');
    }

    const currentProject = this.api.project;

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    if (!this.api.project) {
      throw new Error(
        'Current working project not set. Run `apimetrics config project set` first.'
      );
    }

    const roles = await this.api.list<T.Access>(`projects/${this.api.project}/roles/`);
    if (roles.length > 0) {
      throw new Error(
        `There ${roles.length === 1 ? 'is' : 'are'} ${roles.length} role${
          roles.length === 1 ? '' : 's'
        } currently with access to this project. Please remove all roles before deleting the project.`
      );
    }

    const accounts = await this.api.list<T.Access>(`projects/${this.api.project}/access/`);
    if (accounts.length > 0) {
      throw new Error(
        `There ${accounts.length === 1 ? 'is' : 'are'} ${accounts.length} account${
          accounts.length === 1 ? '' : 's'
        } currently with access to this project. Please remove all accounts before deleting the project.`
      );
    }

    await this.api.delete(`organizations/${orgId}/projects/${this.api.project}/`);

    if (this.api.project === currentProject) {
      // If the user has deleted their current working project, clear
      // their current working project.
      this.userConfig.project.current = undefined;
      await this.userConfig.save();
      this.log(
        'Deleted current working project. You will need to run `apimetrics config project set`.'
      );
    }

    return {success: true};
  }
}
