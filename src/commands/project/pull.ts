import {Flags} from '@oclif/core';
import {Command} from '../../base-command';
import * as fs from 'fs-extra';

export type PullWriteFileJson = {
  success: boolean;
  message: string;
};

export default class Pull extends Command<PullWriteFileJson | any> {
  static description = 'Fetch project.yaml file';
  protected projectOnly = true;

  static examples = ['<%= config.bin %> <%= command.id %> --key <api key>'];

  static flags = {
    out: Flags.file({
      exists: false,
      description: 'File to write project.yaml to.',
      char: 'o',
    }),
    force: Flags.boolean({
      description: 'Force overwriting of existing project.yaml file.',
      char: 'f',
      dependsOn: ['out'],
    }),
    environment: Flags.boolean({
      description: 'Include environment variable data',
      default: true,
      allowNo: true,
    }),
    header: Flags.boolean({description: 'Include header data', default: true, allowNo: true}),
    webhook: Flags.boolean({description: 'Include webhook data', default: true, allowNo: true}),
  };

  public async run(): Promise<PullWriteFileJson | any> {
    const {flags} = await this.parse(Pull);
    const endpoint = `export/?environment_values=${flags.environment}&header_values=${flags.header}&webhooks=${flags.webhook}`;

    // Write project.yaml to file flags.out?
    if (flags.out) {
      const project = await this.api.get<string>(
        endpoint,
        {headers: {Accept: 'application/yaml'}},
        true
      );
      const fileExists = await fs.exists(flags.out);

      // We need to handle --json separately to prevent prompt showing up
      // when --json passed
      if (fileExists && !flags.force && !this.jsonEnabled()) {
        const overwrite = await this.confirm({
          message: `File ${flags.out} already exists. Do you want to overwrite it?`,
          default: false,
        });
        if (!overwrite) {
          this.log('Exited without overwriting file');
          return {success: false, message: 'Exited without overwriting file'};
        }
      } else if (fileExists && !flags.force) {
        throw new Error(`File ${flags.out} already exists. Use --force to overwrite it.`);
      }

      fs.writeFile(flags.out, project);
      this.log(`Wrote project.yaml to ${flags.out}`);
      return {success: true, message: `Wrote project.yaml to ${flags.out}`};
    }

    // Avoid multiple API calls when using --json. Just fetch json from
    // API, instead of YAML.
    if (this.jsonEnabled()) {
      return this.api.get<any>(endpoint, undefined, false);
    }

    this.log(await this.api.get<string>(endpoint, {headers: {Accept: 'application/yaml'}}, true));
  }
}