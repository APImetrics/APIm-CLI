import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const orgAccounts = {
  meta: {},
  results: [
    {email: 'abc@example.com', id: 'auth0|abc123'},
    {email: 'def@example.com', id: 'auth0|def123'},
    {email: 'ghi@example.com', id: 'auth0|ghi123'},
    {email: 'jkl@example.com', id: 'auth0|jkl123'},
    {email: 'mno@example.com', id: 'auth0|mno123'},
    {email: 'pqr@example.com', id: 'auth0|pqr123'},
    {email: 'stu@example.com', id: 'auth0|stu123'},
    {email: 'vwx@example.com', id: 'auth0|vwx123'},
    {email: 'yza@example.com', id: 'auth0|yza123'},
    {email: 'yza@example.com', id: 'auth0|yza123'},
  ],
};

describe('org accounts remove', () => {
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
  const noOrg = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'bearer',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});
  const personalProjects = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: ''},
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
      api.delete('/api/2/organizations/abc123/accounts/qwerty/').reply(200, {});
    })
    .stdout()
    .command(['org:accounts:remove', '--user-id=qwerty', '--json'])
    .it('Remove user (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true});
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/organizations/abc123/accounts/')
        .reply(200, orgAccounts)
        .delete('/api/2/organizations/abc123/accounts/auth0%7Cabc123/')
        .reply(200, {});
    })
    .stdout()
    .command(['org:accounts:remove', '--user-id=abc@example.com', '--json'])
    .it('Remove user using email (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true});
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api.delete('/api/2/organizations/def/accounts/qwerty/').reply(200, {});
    })
    .stdout()
    .command(['org:accounts:remove', '--user-id=qwerty', '--json', '--org-id=def'])
    .it('Remove user passing --org-id flag (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true});
    });

  bearerAuth
    .stderr()
    .command(['org:accounts:remove'])
    .catch((error) => {
      expect(error.message).to.contain('Missing required flag user-id');
    })
    .it('Missing required --user-id flag');

  noOrg
    .stderr()
    .command(['org:accounts:remove', '--user-id=qwerty', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Current organization not set. Run `apimetrics config org set` first.'
      );
    })
    .it('No organization set');
  personalProjects
    .stderr()
    .command(['org:accounts:remove', '--user-id=qwerty', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Personal projects not currently supported. Please use web interface instead.'
      );
    })
    .it('Using personal projects');
});
