/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const accountResponse = {
  meta: {},
  results: [
    {
      name: 'qcmetrics',
      roles: ['ADMIN'],
      created: '2023-07-15T18:32:41.626327Z',
      org_id: 'qcmetrics',
      invited_by: 'auth0|1234567890',
      last_update: '2023-07-15T18:32:41.626336Z',
      access_level: 'VIEWER',
      email: 'jane@example.com',
      id: 'hij789',
      project_id: null,
      invited_email: 'bob@example.com',
    },
    {
      name: 'qcmetrics',
      roles: [],
      created: '2023-07-15T18:34:27.044198Z',
      org_id: 'qcmetrics',
      invited_by: 'auth0|1234567890',
      last_update: '2023-07-15T18:34:27.044204Z',
      access_level: 'VIEWER',
      email: 'john@example.com',
      id: 'efg456',
      project_id: null,
      invited_email: 'bob@example.com',
    },
    {
      name: 'qcmetrics',
      roles: ['DEV_TEAM', 'TEST_ROLE'],
      created: '2023-07-15T18:31:33.918614Z',
      org_id: 'qcmetrics',
      invited_by: 'auth0|1234567890',
      last_update: '2023-07-15T18:31:33.918621Z',
      access_level: 'VIEWER',
      email: 'alice@example.com',
      id: 'abc123',
      project_id: null,
      invited_email: 'bob@example.com',
    },
  ],
};

describe('list invites', () => {
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
      api.get('/api/2/organizations/abc123/invites/').reply(200, accountResponse)
    )
    .stdout()
    .command(['org:invites', '--output=json'])
    .it('Standard columns in JSON', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          email: 'jane@example.com',
          roles: 'ADMIN',
          created: '2023-07-15T18:32:41.626327Z',
        },
        {
          email: 'john@example.com',
          roles: 'None',
          created: '2023-07-15T18:34:27.044198Z',
        },
        {
          email: 'alice@example.com',
          roles: 'DEV_TEAM, TEST_ROLE',
          created: '2023-07-15T18:31:33.918614Z',
        },
      ]);
    });

  keyAuth
    .stderr()
    .command(['org:invites'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Cannot use an API key to authenticate against a non project endpoint. Run `apimetrics login` instead.'
      );
    })
    .it('API key for non project endpoint');

  noOrg
    .stderr()
    .command(['org:invites'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Current organization not set. Run `apimetrics config org set` first.'
      );
    })
    .it('No organization set');
});
