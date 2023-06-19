import {Flags} from '@oclif/core';
import {Command} from '../../../base-command';
import * as inquirer from 'inquirer';

export type SetOrgJson = {
  success: boolean;
  message: string;
};

export default class Set extends Command<SetOrgJson> {
  static description = 'Set the current working organisation';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    'org-id': Flags.string({
      description: 'ID of org to set to',
      char: 'i',
    }),
  };

  public async run(): Promise<SetOrgJson> {
    const {flags} = await this.parse(Set);
    if (flags['org-id']) {
      this.userConfig.organisation.current = flags['org-id'];
      await this.userConfig.save();

      return {success: true, message: 'Set current organisation'};
    }

    if (flags.json) {
      throw new Error(
        'Cannot use --json with interactive mode. Specify organisation using --org-id instead.'
      );
    }

    const availableOrgs = await this.api.get<any>('account/projects');
    this.debug('%O', availableOrgs);

    // Personal projects have an org ID of ""
    const orgs: {name: string; value: string}[] = [{name: 'Personal Projects', value: ''}];
    for (const key of Object.keys(availableOrgs.organizations)) {
      orgs.push({name: availableOrgs[key].name, value: availableOrgs[key].id});
    }

    const response = await inquirer.prompt([
      {
        name: 'organisation',
        message: 'Select an organisation',
        type: 'list',
        choices: orgs,
      },
    ]);

    this.userConfig.organisation.current = response.organisation;
    // Make sure we clear the current project when we switch orgs
    this.userConfig.project.current = undefined;
    this.userConfig.save();

    return {success: true, message: 'Set current organisation'};
  }
}
