/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

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
      created: '2023-07-16T21:53:30.522729Z',
      description: 'A role called bob and dave',
      id: 'BOB_ANDDAVE',
      last_update: '2023-07-16T21:53:30.522736Z',
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
      created: '2023-07-16T21:43:28.709046Z',
      description: 'A test',
      id: 'TEST',
      last_update: '2023-07-16T21:43:28.709053Z',
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

describe('org roles', () => {
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
      api.get('/api/2/organizations/abc123/roles/').reply(200, rolesResponse)
    )
    .stdout()
    .command(['org:roles', '--output=json'])
    .it('List all roles with --output=json argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          created: '2021-02-25T01:53:42.656838Z',
          description: 'Organization Administrator Role',
          role: 'ADMIN',
        },
        {
          created: '2023-07-16T21:53:30.522729Z',
          description: 'A role called bob and dave',
          role: 'BOB_ANDDAVE',
        },
        {
          created: '2023-04-21T16:04:53.261921Z',
          description: 'Debugging team',
          role: 'DEBUGGING',
        },
        {
          created: '2021-02-25T01:53:42.743404Z',
          description: 'Default Role',
          role: 'DEFAULT',
        },
        {
          created: '2020-02-24T03:47:06.541386Z',
          description: 'Development Team',
          role: 'DEV_TEAM',
        },
        {
          created: '2023-07-16T21:43:28.709046Z',
          description: 'A test',
          role: 'TEST',
        },
        {
          created: '2023-02-18T02:40:27.983164Z',
          description: 'A test role I just created',
          role: 'TEST_ROLE',
        },
      ]);
    });

  keyAuth
    .stderr()
    .command(['org:roles'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Cannot use an API key to authenticate against a non project endpoint. Run `apimetrics login` instead.'
      );
    })
    .it('API key for non project endpoint');

  noOrg
    .stderr()
    .command(['org:roles'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Current organization not set. Run `apimetrics config org set` first.'
      );
    })
    .it('No organization set');
});
