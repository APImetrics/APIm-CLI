import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

describe('projects invites delete', () => {
  const bearerAuth = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: 'abc123'},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'bearer',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api.delete('/api/2/projects/abc123/invites/qwerty/').reply(200, {});
    })
    .stdout()
    .command(['projects:invites:delete', '--invite-id=qwerty', '--json'])
    .it('Create invite (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
      });
    });

  bearerAuth
    .stderr()
    .command(['projects:invites:delete'])
    .catch((error) => {
      expect(error.message).to.contain('Missing required flag invite-id');
    })
    .it('Check required flags');
});
