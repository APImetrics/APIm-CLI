/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const roles = {
  meta: {},
  results: [
    {
      access_level: 'VIEWER',
      created: '2023-08-03T15:38:30.206605Z',
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4NXQ68MIDA',
      last_update: '2023-08-03T15:38:30.206611Z',
      project: {
        created: '2015-09-23T21:16:48Z',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgICAgICAgAoM',
        last_update: '2023-08-03T19:02:42.591193Z',
        name: 'My Project',
        org_id: 'qcmetrics',
        system_tags: ['active'],
        tags: [],
      },
      role_id: 'A_ROLE',
    },
    {
      access_level: 'EDITOR',
      created: '2023-08-03T15:36:36.746294Z',
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4NWnwe4JDA',
      last_update: '2023-08-03T15:36:36.746301Z',
      project: {
        created: '2015-09-23T21:16:48Z',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgICAgICAgAoM',
        last_update: '2023-08-03T19:02:42.591193Z',
        name: 'My Project',
        org_id: 'qcmetrics',
        system_tags: ['active'],
        tags: [],
      },
      role_id: 'A_ROLE',
    },
    {
      access_level: 'VIEWER',
      created: '2023-08-03T15:35:09.014425Z',
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4LX4hb4KDA',
      last_update: '2023-08-03T15:35:09.014433Z',
      project: {
        created: '2015-09-23T21:16:48Z',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgICAgICAgAoM',
        last_update: '2023-08-03T19:02:42.591193Z',
        name: 'My Project',
        org_id: 'qcmetrics',
        system_tags: ['active'],
        tags: [],
      },
      role_id: 'ANOTHER_ROLE',
    },
  ],
};

describe('project roles', () => {
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

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/projects/abc123/roles/').reply(200, roles)
    )
    .stdout()
    .command(['projects:roles', '--output=json'])
    .it('Standard columns in JSON', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          accessLevel: 'VIEWER',
          role: 'A_ROLE',
        },
        {
          accessLevel: 'EDITOR',
          role: 'A_ROLE',
        },
        {
          accessLevel: 'VIEWER',
          role: 'ANOTHER_ROLE',
        },
      ]);
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/projects/def/roles/').reply(200, roles)
    )
    .stdout()
    .command(['projects:roles', '--output=json', '-p=def'])
    .it('Passing project ID inline', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          accessLevel: 'VIEWER',
          role: 'A_ROLE',
        },
        {
          accessLevel: 'EDITOR',
          role: 'A_ROLE',
        },
        {
          accessLevel: 'VIEWER',
          role: 'ANOTHER_ROLE',
        },
      ]);
    });
});
