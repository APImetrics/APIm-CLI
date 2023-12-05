import {Interfaces} from '@oclif/core';
import {debug} from 'debug';
import * as fs from 'fs-extra';
import * as path from 'node:path';

export class Config {
  public organization: Config.organization = {
    current: undefined,
  };

  /** Current project settings */
  public project: Config.Project = {
    current: undefined,
  };

  private configDir: string;
  private debug = debug('userconfig');

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
      organization: this.organization,
      project: this.project,
    };
    await fs.writeJson(filePath, config);
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

  /**
   * Load config file from disk
   */
  private load(): void {
    const filePath = path.join(this.configDir, 'config.json');
    if (fs.existsSync(filePath)) {
      // Handling for malformed contents?
      const config = fs.readJsonSync(filePath) as Config.ConfigFile;
      this.debug('Loaded config %O', config);
      this.project = config.project;
      this.organization = config.organization;
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
    organization: organization;
    project: Project;
  }
}
