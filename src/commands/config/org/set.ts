import {Flags} from '@oclif/core';
import {Command} from '../../../base-command/index.js';
import {select} from '@inquirer/prompts';
import {HTTPError} from 'http-call';

export type SetOrgJson = {
  success: boolean;
  message: string;
};

export default class Set extends Command<SetOrgJson> {
  static description = 'Set the current working organization.';

  static examples = ['<%= config.bin %> <%= command.id %>  --org-id abccorp'];

  static flags = {
    'org-id': Flags.string({
      description: 'ID of org to set to.',
      char: 'o',
    }),
  };

  public async run(): Promise<SetOrgJson> {
    const {flags} = await this.parse(Set);
    if (flags['org-id']) {
      try {
        await this.api.get(`project/organization/${flags['org-id']}/`);
      } catch (error) {
        // Log original error to debug
        this.debug('GET project/organization/%s/ resulted in error: %O', flags['org-id'], error);
        if (error instanceof HTTPError && (error.statusCode === 401 || error.statusCode === 403)) {
          throw new Error(`Invalid organization ID (${flags['org-id']}).`);
        }

        throw error;
      }

      this.userConfig.organization.current = flags['org-id'];
      await this.userConfig.save();

      return {success: true, message: 'Set current organization.'};
    }

    if (flags.json) {
      throw new Error(
        'Cannot use --json with interactive mode. Specify organization using --org-id instead.'
      );
    }

    const availableOrgs = await this.api.get<any>('account/projects');
    this.debug('%O', availableOrgs);

    // Personal projects have an org ID of ""
    const orgs: {name: string; value: string}[] = [{name: 'Personal Projects', value: ''}];
    for (const key of Object.keys(availableOrgs.organizations)) {
      orgs.push({
        name: availableOrgs.organizations[key].name,
        value: availableOrgs.organizations[key].id,
      });
    }

    const response = await select({
      message: 'Select an organization',
      choices: orgs,
    });

    this.userConfig.organization.current = response;
    // Make sure we clear the current project when we switch orgs
    this.userConfig.project.current = undefined;
    await this.userConfig.save();

    return {success: true, message: 'Set current organization.'};
  }
}
