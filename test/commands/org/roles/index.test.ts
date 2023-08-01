/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const rolesResponse = {
  meta: {},
  results: [
    {
      description: 'Organization Administrator Role',
      created: '2021-02-25T01:53:42.656838Z',
      org_id: 'qcmetrics',
      id: 'ADMIN',
      last_update: '2021-02-25T01:53:42.656841Z',
    },
    {
      description: 'A role called bob and dave',
      created: '2023-07-16T21:53:30.522729Z',
      org_id: 'qcmetrics',
      id: 'BOB_ANDDAVE',
      last_update: '2023-07-16T21:53:30.522736Z',
    },
    {
      description: 'Debugging team',
      created: '2023-04-21T16:04:53.261921Z',
      org_id: 'qcmetrics',
      id: 'DEBUGGING',
      last_update: '2023-04-21T16:04:53.261929Z',
    },
    {
      description: 'Default Role',
      created: '2021-02-25T01:53:42.743404Z',
      org_id: 'qcmetrics',
      id: 'DEFAULT',
      last_update: '2021-02-25T01:53:42.743408Z',
    },
    {
      description: 'Development Team',
      created: '2020-02-24T03:47:06.541386Z',
      org_id: 'qcmetrics',
      id: 'DEV_TEAM',
      last_update: '2020-02-24T03:47:06.541393Z',
    },
    {
      description: 'A test',
      created: '2023-07-16T21:43:28.709046Z',
      org_id: 'qcmetrics',
      id: 'TEST',
      last_update: '2023-07-16T21:43:28.709053Z',
    },
    {
      description: 'A test role I just created',
      created: '2023-02-18T02:40:27.983164Z',
      org_id: 'qcmetrics',
      id: 'TEST_ROLE',
      last_update: '2023-02-18T02:40:27.983173Z',
    },
  ],
};

describe('list roles', () => {
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
      api.get('/api/2/organizations/abc123/roles/').reply(200, rolesResponse)
    )
    .stdout()
    .command(['org:roles', '--output=json'])
    .it('Standard columns in JSON', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          role: 'ADMIN',
          description: 'Organization Administrator Role',
          created: '2021-02-25T01:53:42.656838Z',
        },
        {
          role: 'BOB_ANDDAVE',
          description: 'A role called bob and dave',
          created: '2023-07-16T21:53:30.522729Z',
        },
        {
          role: 'DEBUGGING',
          description: 'Debugging team',
          created: '2023-04-21T16:04:53.261921Z',
        },
        {
          role: 'DEFAULT',
          description: 'Default Role',
          created: '2021-02-25T01:53:42.743404Z',
        },
        {
          role: 'DEV_TEAM',
          description: 'Development Team',
          created: '2020-02-24T03:47:06.541386Z',
        },
        {
          role: 'TEST',
          description: 'A test',
          created: '2023-07-16T21:43:28.709046Z',
        },
        {
          role: 'TEST_ROLE',
          description: 'A test role I just created',
          created: '2023-02-18T02:40:27.983164Z',
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
