import {Flags} from '@oclif/core';
import * as fs from 'fs-extra';

import {Command} from '../../base-command';

export type PullWriteFileJson = {
  message: string;
  success: boolean;
};

export default class Pull extends Command<PullWriteFileJson | unknown> {
  static description = 'Fetch project.yaml file.';
  static examples = [
    `<%= config.bin %> <%= command.id %> --out myproject.yaml
Wrote project.yaml to myproject.yaml.`,
  ];

  static flags = {
    environment: Flags.boolean({
      allowNo: true,
      default: true,
      description: 'Include environment variable data.',
    }),
    force: Flags.boolean({
      char: 'f',
      dependsOn: ['out'],
      description: 'Force overwriting of existing project.yaml file.',
    }),
    header: Flags.boolean({allowNo: true, default: true, description: 'Include header data.'}),
    out: Flags.file({
      char: 'o',
      description: 'File to write project.yaml to.',
      exists: false,
    }),
    'project-id': Flags.string({
      char: 'p',
      description: 'ID of project to modify. Overrides apimetrics config project set.',
    }),
    webhook: Flags.boolean({allowNo: true, default: true, description: 'Include webhook data.'}),
  };

  protected permitKeyAuth = true;

  public async run(): Promise<PullWriteFileJson | unknown> {
    const {flags} = await this.parse(Pull);
    const endpoint = `export/?environment_values=${flags.environment}&header_values=${flags.header}&webhooks=${flags.webhook}`;

    if (flags['project-id']) {
      this.api.project = flags['project-id'];
    }

    // Write project.yaml to file flags.out?
    if (flags.out) {
      const project = await this.api.get<string>(endpoint, {
        headers: {Accept: 'application/yaml'},
        plain: true,
      });
      const fileExists = await fs.exists(flags.out);

      // We need to handle --json separately to prevent prompt showing up
      // when --json passed
      if (fileExists && !flags.force && !this.jsonEnabled()) {
        const overwrite = await this.confirm({
          default: false,
          message: `File ${flags.out} already exists. Do you want to overwrite it?`,
        });
        if (!overwrite) {
          this.log('Exited without overwriting file.');
          return {message: 'Exited without overwriting file.', success: false};
        }
      } else if (fileExists && !flags.force) {
        throw new Error(`File ${flags.out} already exists. Use --force to overwrite it.`);
      }

      fs.writeFile(flags.out, project);
      this.log(`Wrote project.yaml to ${flags.out}.`);
      return {message: `Wrote project.yaml to ${flags.out}.`, success: true};
    }

    // Avoid multiple API calls when using --json. Just fetch json from
    // API, instead of YAML.
    if (this.jsonEnabled()) {
      return this.api.get<unknown>(endpoint);
    }

    this.log(
      await this.api.get<string>(endpoint, {headers: {Accept: 'application/yaml'}, plain: true})
    );
  }
}
