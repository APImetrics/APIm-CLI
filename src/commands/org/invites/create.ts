import {Flags} from '@oclif/core';

import {Command, T, util} from '../../../base-command';

export type InviteResponse = {
  invite: T.Invite;
  success: boolean;
};

export default class Create extends Command<InviteResponse> {
  static description = 'Create an invite to the organization.';

  static examples = [
    `<%= config.bin %> <%= command.id %> --email bob@example.com --role ADMIN --role DEV_TEAM
ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9ajJsyoM`,
  ];

  static flags = {
    email: Flags.string({description: 'Email to send invite to.', required: true}),
    'org-id': Flags.string({
      char: 'o',
      description: 'ID of organization to modify. Overrides apimetrics config org set.',
    }),
    role: Flags.string({description: 'Users role.', multiple: true, required: true}),
  };

  public async run(): Promise<InviteResponse> {
    const {flags} = await this.parse(Create);

    const orgId = flags['org-id'] ?? this.userConfig.organization.current;
    if (orgId === undefined) {
      throw new Error('Current organization not set. Run `apimetrics config org set` first.');
    } else if (orgId === '') {
      throw new Error('Organization invites not supported for personal projects.');
    }

    if (!util.validateEmail(flags.email)) {
      throw new Error(`Invalid email: ${flags.email}.`);
    }

    let endpoint = `organizations/${orgId}/roles/`;
    const rawRoles = await this.api.list<T.Role>(endpoint);
    const roles: string[] = [];
    for (const role of rawRoles) {
      roles.push(role.id);
    }

    for (const role of flags.role) {
      if (!roles.includes(role)) {
        throw new Error(`Unrecognized role ${role}.`);
      }
    }

    endpoint = `organizations/${orgId}/invites/`;
    const data = {
      email: flags.email,
      roles: flags.role,
    };
    const invite = await this.api.post<T.Invite>(endpoint, {body: data});
    this.log(invite.id);
    return {invite, success: true};
  }
}
