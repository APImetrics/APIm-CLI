import {Command, T} from '../../base-command';

export type WhoamiResponse = {
  success: boolean;
  whoami: {
    current_org: string;
    current_project: {
      id: string;
      name: string;
    };
    email: string;
    id: string;
    mfa: boolean;
    name: string;
  };
};

export default class Whoami extends Command<WhoamiResponse> {
  static description = 'Show details about the currently logged in user.';

  static examples = [
    `<%= config.bin %> <%= command.id %>
ID:                   auth0|109e70845ef23eb4099c209p
Name:                 Bob
Email:                bob@example.com
MFA enabled:          false
Current Organization: companya
Current Project Name: My Project
Current Project ID:   ag9zfmFwaWasfHJpY3MtclpsEQsSBFVzZyu;gIDgpdG73QoM`,
  ];

  public async run(): Promise<WhoamiResponse> {
    const userinfo = await this.api.userinfo();
    let projectName: string | undefined;

    if (this.userConfig.project.current) {
      const response = await this.api.get<T.Project>(`projects/${this.api.project}`);
      projectName = response.name;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, {title: string; value: any}> = {
      id: {
        title: 'ID',
        value: userinfo.sub,
      },
      name: {
        title: 'Name',
        value: userinfo.nickname,
      },
      // eslint-disable-next-line perfectionist/sort-objects
      email: {
        title: 'Email',
        value: userinfo.email,
      },
      mfa: {
        title: 'MFA enabled',
        value: userinfo['https://client.apimetrics.io/use_mfa'],
      },
      // eslint-disable-next-line perfectionist/sort-objects
      currentOrg: {
        title: 'Current Organization',
        value: this.userConfig.organization.current || '',
      },
      currentProjectName: {
        title: 'Current Project Name',
        value: projectName || '',
      },
      // eslint-disable-next-line perfectionist/sort-objects
      currentProjectID: {
        title: 'Current Project ID',
        value: this.userConfig.project.current || '',
      },
    };

    // +2 for colon + space between longest title and value
    const padding = Math.max(...Object.values(data).map((entry) => entry.title.length)) + 2;

    for (const entry of Object.values(data)) {
      this.log((entry.title + ': ').padEnd(padding) + entry.value);
    }

    return {
      success: true,
      whoami: {
        // eslint-disable-next-line camelcase
        current_org: data.currentOrg.value,
        // eslint-disable-next-line camelcase
        current_project: {
          id: data.currentProjectID.value,
          name: data.currentProjectName.value,
        },
        email: data.email.value,
        id: data.id.value,
        mfa: data.mfa.value,
        name: data.name.value,
      },
    };
  }
}
