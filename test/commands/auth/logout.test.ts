import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';
import * as path from 'node:path';

describe('auth logout', () => {
  const withRefreshToken = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: 'abc123'},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        mode: 'device',
        refresh: 'abc123',
        token: 'abc123',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'})
    .env({APIMETRICS_CLIENT_ID: '123'})
    .env({APIMETRICS_REVOKE_URL: 'https://auth.apimetrics.io/oauth/revoke'});

  const noRefreshToken = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: 'abc123'},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        mode: 'device',
        refresh: '',
        token: 'abc123',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'})
    .env({APIMETRICS_REVOKE_URL: 'https://auth.apimetrics.io/oauth/revoke'});

  const auth = test
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

  auth
    .stdout()
    .command(['auth:logout'])
    .it('Log out', (ctx) => {
      expect(ctx.stdout).to.contain('Logged out');
    });

  withRefreshToken
    .nock('https://auth.apimetrics.io', (api) =>
      // eslint-disable-next-line camelcase
      api.post('/oauth/revoke', {client_id: '123', token: 'abc123'}).reply(200, {})
    )
    .stdout()
    .command(['auth:logout'])
    .it('Log out and revoke refresh token', (ctx) => {
      expect(ctx.stdout).to.contain('Logged out');
    });

  noRefreshToken
    .stderr()
    .stdout()
    .command(['auth:logout'])
    .it('Log out with falsy refresh token', (ctx) => {
      expect(ctx.stdout).to.contain('Logged out');
      expect(ctx.stderr).to.contain(
        'Did not attempt to revoke refresh token as token was undefined.'
      );
    });
});
