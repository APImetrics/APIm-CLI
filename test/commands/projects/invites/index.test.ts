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
      invited_by: 'auth0|1234567890',
      last_update: '2023-07-15T18:32:41.626336Z',
      access_level: 'VIEWER',
      email: 'jane@example.com',
      id: 'hij789',
      project_id: 'abc123',
      invited_email: 'bob@example.com',
    },
    {
      name: 'qcmetrics',
      roles: [],
      created: '2023-07-15T18:34:27.044198Z',
      invited_by: 'auth0|1234567890',
      last_update: '2023-07-15T18:34:27.044204Z',
      access_level: 'VIEWER',
      email: 'john@example.com',
      id: 'efg456',
      project_id: 'abc123',
      invited_email: 'bob@example.com',
    },
    {
      name: 'qcmetrics',
      roles: ['DEV_TEAM', 'TEST_ROLE'],
      created: '2023-07-15T18:31:33.918614Z',
      invited_by: 'auth0|1234567890',
      last_update: '2023-07-15T18:31:33.918621Z',
      access_level: 'VIEWER',
      email: 'alice@example.com',
      id: 'abc123',
      project_id: 'abc123',
      invited_email: 'bob@example.com',
    },
  ],
};

describe('projects invites', () => {
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

  const noProject = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {},
        project: {},
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
      api.get('/api/2/projects/abc123/invites/').reply(200, accountResponse)
    )
    .stdout()
    .command(['projects:invites', '--output=json'])
    .it('Standard columns in JSON', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          email: 'jane@example.com',
          created: '2023-07-15T18:32:41.626327Z',
          accessLevel: 'VIEWER',
        },
        {
          email: 'john@example.com',
          created: '2023-07-15T18:34:27.044198Z',
          accessLevel: 'VIEWER',
        },
        {
          email: 'alice@example.com',
          created: '2023-07-15T18:31:33.918614Z',
          accessLevel: 'VIEWER',
        },
      ]);
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/projects/def/invites/').reply(200, accountResponse)
    )
    .stdout()
    .command(['projects:invites', '--output=json', '-p=def'])
    .it('Standard columns in JSON passing project ID', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          email: 'jane@example.com',
          created: '2023-07-15T18:32:41.626327Z',
          accessLevel: 'VIEWER',
        },
        {
          email: 'john@example.com',
          created: '2023-07-15T18:34:27.044198Z',
          accessLevel: 'VIEWER',
        },
        {
          email: 'alice@example.com',
          created: '2023-07-15T18:31:33.918614Z',
          accessLevel: 'VIEWER',
        },
      ]);
    });

  noProject
    .stderr()
    .command(['projects:invites'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Current working project not set. Run `apimetrics config project set` first.'
      );
    })
    .it('No project set');
});
