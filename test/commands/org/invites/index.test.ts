/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const accountResponse = {
  meta: {},
  results: [
    {
      access_level: 'VIEWER',
      created: '2023-07-15T18:32:41.626327Z',
      email: 'jane@example.com',
      id: 'hij789',
      invited_by: 'auth0|1234567890',
      invited_email: 'bob@example.com',
      last_update: '2023-07-15T18:32:41.626336Z',
      name: 'qcmetrics',
      org_id: 'qcmetrics',
      project_id: null,
      roles: ['ADMIN'],
    },
    {
      access_level: 'VIEWER',
      created: '2023-07-15T18:34:27.044198Z',
      email: 'john@example.com',
      id: 'efg456',
      invited_by: 'auth0|1234567890',
      invited_email: 'bob@example.com',
      last_update: '2023-07-15T18:34:27.044204Z',
      name: 'qcmetrics',
      org_id: 'qcmetrics',
      project_id: null,
      roles: [],
    },
    {
      access_level: 'VIEWER',
      created: '2023-07-15T18:31:33.918614Z',
      email: 'alice@example.com',
      id: 'abc123',
      invited_by: 'auth0|1234567890',
      invited_email: 'bob@example.com',
      last_update: '2023-07-15T18:31:33.918621Z',
      name: 'qcmetrics',
      org_id: 'qcmetrics',
      project_id: null,
      roles: ['DEV_TEAM', 'TEST_ROLE'],
    },
  ],
};

describe('org invites', () => {
  const bearerAuth = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: 'abc123'},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        mode: 'bearer',
        token: 'abc123',
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
        mode: 'key',
        token: 'abc123',
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
        mode: 'bearer',
        token: 'abc123',
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
          created: '2023-07-15T18:32:41.626327Z',
          email: 'jane@example.com',
          roles: 'ADMIN',
        },
        {
          created: '2023-07-15T18:34:27.044198Z',
          email: 'john@example.com',
          roles: 'None',
        },
        {
          created: '2023-07-15T18:31:33.918614Z',
          email: 'alice@example.com',
          roles: 'DEV_TEAM, TEST_ROLE',
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
