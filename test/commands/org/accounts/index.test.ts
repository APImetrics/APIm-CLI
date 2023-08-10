/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const accountResponse = {
  meta: {},
  results: [
    {
      name: 'Bob',
      email: 'bob@example.com',
      last_login: '2021-09-01T05:23:20.337Z',
      last_ip: '123.123.123.123',
      logins_count: 2,
      app_metadata: {
        org_roles: {
          abc123: ['DEFAULT', 'DAVE'],
        },
      },
    },
    {
      name: 'Dave',
      email: 'dave@example.com',
      last_login: '2021-09-01T05:23:20.337Z',
      last_ip: '123.123.123.123',
      logins_count: 2,
      app_metadata: {
        abc123: ['DEFAULT', 'DAVE'],
      },
    },
    {
      name: 'Alice',
      email: 'alice@example.com',
      last_login: '2021-09-01T05:23:20.337Z',
      last_ip: '123.123.123.123',
      logins_count: 2,
      permissions: ['DEFAULT', 'DAVE'],
    },
    {
      name: 'Fred',
      email: 'fred@example.com',
      last_login: '2021-09-01T05:23:20.337Z',
      last_ip: '123.123.123.123',
      logins_count: 2,
      app_metadata: {},
    },
  ],
};

describe('org accounts', () => {
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

  const keyAuth = test
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

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/organizations/abc123/accounts').reply(200, accountResponse)
    )
    .stdout()
    .command(['org:accounts', '--output=json'])
    .it('List all organisation accounts with --output=json argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          email: 'bob@example.com',
          lastLogin: '2021-09-01T05:23:20.337Z',
          name: 'Bob',
          roles: 'DEFAULT, DAVE',
        },
        {
          email: 'dave@example.com',
          lastLogin: '2021-09-01T05:23:20.337Z',
          name: 'Dave',
          roles: 'DEFAULT, DAVE',
        },
        {
          email: 'alice@example.com',
          lastLogin: '2021-09-01T05:23:20.337Z',
          name: 'Alice',
          roles: 'DEFAULT, DAVE',
        },
        {
          email: 'fred@example.com',
          lastLogin: '2021-09-01T05:23:20.337Z',
          name: 'Fred',
          roles: '',
        },
      ]);
    });

  keyAuth
    .stderr()
    .command(['org:accounts'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Cannot use an API key to authenticate against a non project endpoint. Run `apimetrics login` instead.'
      );
    })
    .it('Use API key authentication for an endpoint not supporting API keys');

  noOrg
    .stderr()
    .command(['org:accounts'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Current organization not set. Run `apimetrics config org set` first.'
      );
    })
    .it('No organization set');
});
