/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const inviteResponse = {
  access_level: 'VIEWER',
  created: '2023-07-16T17:06:37.371832Z',
  email: 'test@example.com',
  id: 'abc123',
  invited_by: 'auth0|1234567890',
  invited_email: 'bob@example.com',
  last_update: '2023-07-16T17:06:37.430652Z',
  name: 'qcmetrics',
  org_id: 'qcmetrics',
  project_id: null,
  roles: ['ADMIN'],
};

const rolesResponse = {
  meta: {},
  results: [
    {
      created: '2021-02-25T01:53:42.656838Z',
      description: 'Organization Administrator Role',
      id: 'ADMIN',
      last_update: '2021-02-25T01:53:42.656841Z',
      org_id: 'qcmetrics',
    },
    {
      created: '2023-04-21T16:04:53.261921Z',
      description: 'Debugging team',
      id: 'DEBUGGING',
      last_update: '2023-04-21T16:04:53.261929Z',
      org_id: 'qcmetrics',
    },
    {
      created: '2021-02-25T01:53:42.743404Z',
      description: 'Default Role',
      id: 'DEFAULT',
      last_update: '2021-02-25T01:53:42.743408Z',
      org_id: 'qcmetrics',
    },
    {
      created: '2020-02-24T03:47:06.541386Z',
      description: 'Development Team',
      id: 'DEV_TEAM',
      last_update: '2020-02-24T03:47:06.541393Z',
      org_id: 'qcmetrics',
    },
    {
      created: '2023-02-18T02:40:27.983164Z',
      description: 'A test role I just created',
      id: 'TEST_ROLE',
      last_update: '2023-02-18T02:40:27.983173Z',
      org_id: 'qcmetrics',
    },
  ],
};

const inviteRequest = {
  email: 'test@example.com',
  roles: ['ADMIN'],
};

describe('org invites create', () => {
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
      api
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, rolesResponse)
        .post('/api/2/organizations/abc123/invites/', inviteRequest)
        .reply(200, inviteResponse)
    )
    .stdout()
    .command(['org:invites:create', '--email', 'test@example.com', '--role', 'ADMIN'])
    .it('Non interactive create', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  bearerAuth
    .stderr()
    .command(['org:invites:create', '--email', 'testexample.com', '--role', 'ADMIN'])
    .catch((error) => {
      expect(error.message).to.contain('Invalid email: testexample.com');
    })
    .it('Invalid email');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/organizations/abc123/roles/').reply(200, rolesResponse)
    )
    .stderr()
    .command(['org:invites:create', '--email', 'test@example.com', '--role', 'BOB'])
    .catch((error) => {
      expect(error.message).to.contain('Unrecognized role BOB');
    })
    .it('Invalid role');

  keyAuth
    .stderr()
    .command(['org:invites:create', '--email', 'test@example.com', '--role', 'ADMIN'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Cannot use an API key to authenticate against a non project endpoint. Run `apimetrics login` instead.'
      );
    })
    .it('API key for non project endpoint');

  noOrg
    .stderr()
    .command(['org:invites:create', '--email', 'test@example.com', '--role', 'ADMIN'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Current organization not set. Run `apimetrics config org set` first.'
      );
    })
    .it('No organization set');
});
