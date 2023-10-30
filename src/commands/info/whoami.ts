import {Command, T} from '../../base-command';

export type WhoamiResponse = {
  success: boolean;
  whoami: {
    id: string;
    name: string;
    email: string;
    mfa: boolean;
    // eslint-disable-next-line camelcase
    current_org: string;
    // eslint-disable-next-line camelcase
    current_project: {
      name: string;
      id: string;
    };
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
      projectName = (await this.api.get<T.Project>(`projects/${this.api.project}`)).name;
    }

    const data: Record<string, {title: string; value: any}> = {
      id: {
        title: 'ID',
        value: userinfo.sub,
      },
      name: {
        title: 'Name',
        value: userinfo.nickname,
      },
      email: {
        title: 'Email',
        value: userinfo.email,
      },
      mfa: {
        title: 'MFA enabled',
        value: userinfo['https://client.apimetrics.io/use_mfa'],
      },
      currentOrg: {
        title: 'Current Organization',
        value: this.userConfig.organization.current || '',
      },
      currentProjectName: {
        title: 'Current Project Name',
        value: projectName || '',
      },
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
        id: data.id.value,
        name: data.name.value,
        email: data.email.value,
        mfa: data.mfa.value,
        // eslint-disable-next-line camelcase
        current_org: data.currentOrg.value,
        // eslint-disable-next-line camelcase
        current_project: {
          name: data.currentProjectName.value,
          id: data.currentProjectID.value,
        },
      },
    };
  }
}
