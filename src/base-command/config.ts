import {Interfaces} from '@oclif/core';
import * as path from 'node:path';
import * as fs from 'fs-extra';
import {debug} from 'debug';

export class Config {
  /** Current project settings */
  public project: Config.Project = {
    current: undefined,
  };

  public organisation: Config.Organisation = {
    current: undefined,
  };

  private debug = debug('userconfig');

  /**
   * @param oclifConfig Command config
   */
  constructor(private readonly oclifConfig: Interfaces.Config) {
    this.initConfig();
    this.load();
  }

  /**
   * Save the changes in config
   */
  public async save(): Promise<void> {
    const filePath = path.join(this.oclifConfig.configDir, 'config.json');
    const config: Config.ConfigFile = {
      project: this.project,
      organisation: this.organisation,
    };
    await fs.writeJson(filePath, config);
  }

  /**
   * Load config file from disk
   */
  private load(): void {
    const filePath = path.join(this.oclifConfig.configDir, 'config.json');
    if (fs.existsSync(filePath)) {
      // Handling for malformed contents?
      const config = fs.readJsonSync(filePath) as Config.ConfigFile;
      this.debug('Loaded config %O', config);
      this.project = config.project;
      this.organisation = config.organisation;
    }
  }

  /**
   * Ensure that required config directories are present
   */
  private initConfig(): void {
    if (!fs.existsSync(this.oclifConfig.configDir)) {
      this.debug(`Creating ${this.oclifConfig.configDir}`);
      fs.mkdirSync(this.oclifConfig.configDir);
    }
  }
}

export namespace Config {
  export interface Project {
    current: string | undefined;
  }

  export interface Organisation {
    current: string | undefined;
  }

  export interface ConfigFile {
    project: Project;
    organisation: Organisation;
  }
}
