import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

describe('delete role', () => {
  const bearerAuth = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organisation: {current: 'abc123'},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'bearer',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});

  const keyAuth = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organisation: {current: 'abc123'},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'key',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});

  const noOrg = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organisation: {},
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
    .nock('https://client.apimetrics.io', (api) =>
      api.delete('/api/2/organizations/abc123/roles/A_ROLE/').reply(200, {})
    )
    .stdout()
    .command(['org:roles:delete', '-r', 'A_ROLE'])
    .it('Non interactive delete');

  bearerAuth
    .stderr()
    .command(['org:roles:delete', '--json'])
    .catch((error) => {
      expect(error.message).to.contain('No role selected for deletion.');
    })
    .it('Delete with --json missing --invite-id');

  keyAuth
    .stderr()
    .command(['org:roles:delete', '-r', 'A_ROLE'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Cannot use an API key to authenticate against a non project endpoint. Run `apimetrics login` instead.'
      );
    })
    .it('API key for non project endpoint');

  noOrg
    .stderr()
    .command(['org:roles:delete', '-r', 'A_ROLE'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Current organisation not set. Run `apimetrics config org set` first.'
      );
    })
    .it('No organisation set');
});
