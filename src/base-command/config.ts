import {Interfaces} from '@oclif/core';
import * as path from 'node:path';
import fs from 'fs';
import fse from 'fs-extra';
import debug from 'debug';

export class Config {
  /** Current project settings */
  public project: Config.Project = {
    current: undefined,
  };

  public organization: Config.organization = {
    current: undefined,
  };

  private debug = debug('userconfig');
  private configDir: string;

  /**
   * @param oclifConfig Command config
   */
  constructor(private readonly oclifConfig: Interfaces.Config) {
    this.configDir = process.env.APIMETRICS_CONFIG_DIR || this.oclifConfig.configDir;
    this.initConfig();
    this.load();
  }

  /**
   * Save the changes in config
   */
  public async save(): Promise<void> {
    const filePath = path.join(this.configDir, 'config.json');
    const config: Config.ConfigFile = {
      project: this.project,
      organization: this.organization,
    };
    await fse.writeJson(filePath, config);
  }

  /**
   * Load config file from disk
   */
  private load(): void {
    const filePath = path.join(this.configDir, 'config.json');
    if (fs.existsSync(filePath)) {
      // Handling for malformed contents?
      const config = fse.readJsonSync(filePath) as Config.ConfigFile;
      this.debug('Loaded config %O', config);
      this.project = config.project;
      this.organization = config.organization;
    }
  }

  /**
   * Ensure that required config directories are present
   */
  private initConfig(): void {
    if (!fs.existsSync(this.configDir)) {
      this.debug(`Creating ${this.configDir}`);
      fs.mkdirSync(this.configDir);
    }
  }
}

export namespace Config {
  export interface Project {
    current: string | undefined;
  }

  export interface organization {
    current: string | undefined;
  }

  export interface ConfigFile {
    project: Project;
    organization: organization;
  }
}
