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
      project_id: 'abc123',
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
      project_id: 'abc123',
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
      project_id: 'abc123',
      roles: ['DEV_TEAM', 'TEST_ROLE'],
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
        mode: 'bearer',
        token: 'abc123',
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
        mode: 'bearer',
        token: 'abc123',
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
          accessLevel: 'VIEWER',
          created: '2023-07-15T18:32:41.626327Z',
          email: 'jane@example.com',
        },
        {
          accessLevel: 'VIEWER',
          created: '2023-07-15T18:34:27.044198Z',
          email: 'john@example.com',
        },
        {
          accessLevel: 'VIEWER',
          created: '2023-07-15T18:31:33.918614Z',
          email: 'alice@example.com',
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
          accessLevel: 'VIEWER',
          created: '2023-07-15T18:32:41.626327Z',
          email: 'jane@example.com',
        },
        {
          accessLevel: 'VIEWER',
          created: '2023-07-15T18:34:27.044198Z',
          email: 'john@example.com',
        },
        {
          accessLevel: 'VIEWER',
          created: '2023-07-15T18:31:33.918614Z',
          email: 'alice@example.com',
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
