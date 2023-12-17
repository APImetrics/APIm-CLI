import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

describe('workflows delete', () => {
  const auth = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: 'abc123'},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'key',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api.delete('/api/2/workflows/qwerty/').reply(200, {})
    )
    .stdout()
    .command(['workflows:delete', '--workflow-id=qwerty', '--json'])
    .it('Delete workflow', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
      });
    });

  auth
    .stderr()
    .command(['workflows:delete'])
    .catch((error) => {
      expect(error.message).to.contain('Missing required flag workflow-id');
    })
    .it('Missing required options');
});
