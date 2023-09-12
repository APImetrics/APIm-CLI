/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const accessResponse = {
  meta: {},
  results: [
    {
      project: {
        name: 'My Project',
        tags: [],
        system_tags: ['active'],
        created: '2015-09-23T21:16:48Z',
        org_id: 'qcmetrics',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgICAgICAgAoM',
        last_update: '2023-08-03T19:02:42.591193Z',
      },
      access_level: 'VIEWER',
      account_email: 'bob@example.com',
      created: '2023-08-03T15:38:30.206605Z',
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4NXQ68MIDA',
      account_id: 'auth0|mynameisbob',
      last_update: '2023-08-03T15:38:30.206611Z',
    },
    {
      project: {
        name: 'My Project',
        tags: [],
        system_tags: ['active'],
        created: '2015-09-23T21:16:48Z',
        org_id: 'qcmetrics',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgICAgICAgAoM',
        last_update: '2023-08-03T19:02:42.591193Z',
      },
      access_level: 'VIEWER',
      account_email: 'alice@example.com',
      created: '2023-08-03T15:36:36.746294Z',
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4NWnwe4JDA',
      account_id: 'auth0|647ljfdgdnhnfjsgzbfdjgjbsnvknsh',
      last_update: '2023-08-03T15:36:36.746301Z',
    },
    {
      project: {
        name: 'My Project',
        tags: [],
        system_tags: ['active'],
        created: '2015-09-23T21:16:48Z',
        org_id: 'qcmetrics',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgICAgICAgAoM',
        last_update: '2023-08-03T19:02:42.591193Z',
      },
      access_level: 'VIEWER',
      account_email: 'dave@example.com',
      created: '2023-08-03T15:35:09.014425Z',
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4LX4hb4KDA',
      account_id: 'auth0|647ljfdgdnhnfjsgzbfdjgjbsnvknsh',
      last_update: '2023-08-03T15:35:09.014433Z',
    },
    {
      project: {
        name: 'My Project',
        tags: [],
        system_tags: ['active'],
        created: '2015-09-23T21:16:48Z',
        org_id: 'qcmetrics',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgICAgICAgAoM',
        last_update: '2023-08-03T19:02:42.591193Z',
      },
      access_level: 'VIEWER',
      account_email: 'charlotte@example.com',
      created: '2023-08-03T15:36:49.567772Z',
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4KX0xcgKDA',
      account_id: 'auth0|abc123',
      last_update: '2023-08-03T15:36:49.567778Z',
    },
  ],
};

describe('project accounts', () => {
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

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/projects/abc123/access/').reply(200, accessResponse)
    )
    .stdout()
    .command(['projects:accounts', '--output=json'])
    .it('Standard columns in JSON', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          email: 'bob@example.com',
          accessLevel: 'VIEWER',
        },
        {
          email: 'alice@example.com',
          accessLevel: 'VIEWER',
        },
        {
          email: 'dave@example.com',
          accessLevel: 'VIEWER',
        },
        {
          email: 'charlotte@example.com',
          accessLevel: 'VIEWER',
        },
      ]);
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/projects/321cba/access/').reply(200, accessResponse)
    )
    .stdout()
    .command(['projects:accounts', '--output=json', '-p321cba'])
    .it('Passing project ID inline', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          email: 'bob@example.com',
          accessLevel: 'VIEWER',
        },
        {
          email: 'alice@example.com',
          accessLevel: 'VIEWER',
        },
        {
          email: 'dave@example.com',
          accessLevel: 'VIEWER',
        },
        {
          email: 'charlotte@example.com',
          accessLevel: 'VIEWER',
        },
      ]);
    });
});
