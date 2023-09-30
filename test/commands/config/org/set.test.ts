import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';
import * as path from 'node:path';

describe('config org set', () => {
  const conf = test
    .do(() => {
      fs.readdir('./.test', (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(path.join('./.test', file), (err) => {
            if (err) throw err;
          });
        }
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'});

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

  conf
    .stderr()
    .command(['config:org:set', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Cannot use --json with interactive mode. Specify organization using --org-id instead.'
      );
    })
    .it('Use --json argument without passing --org-id');

  conf
    .stderr()
    .command(['config:org:set', '--org-id=abc123'])
    .catch((error) => {
      expect(error.message).to.contain('Not logged in. Run apimetrics login first.');
    })
    .it('Not logged in.');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/project/organization/abc123/').reply(200, {})
    )
    .stdout()
    .command(['config:org:set', '--org-id=abc123'])
    .it('Set org passing --org-id argument', (ctx) => {
      expect(ctx.stdout).to.equal('');
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/project/organization/abc123/').reply(403, {})
    )
    .stderr()
    .command(['config:org:set', '--org-id=abc123'])
    .catch((error) => {
      expect(error.message).to.contain('Invalid organization ID (abc123).');
    })
    .it('Invalid org id');
});
