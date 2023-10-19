import {Command} from '../../base-command';

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
    current_project: string;
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
Current Project:      ag9zfmFwaWasfHJpY3MtclpsEQsSBFVzZyu;gIDgpdG73QoM`,
  ];

  public async run(): Promise<WhoamiResponse> {
    const userinfo = await this.api.userinfo();
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
      currentProject: {
        title: 'Current Project',
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
        current_project: data.currentProject.value,
      },
    };
  }
}
