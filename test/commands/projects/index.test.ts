/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const projects = {
  meta: {},
  organizations: {
    abc123: {
      id: 'abc123',
    },
  },
  projects: [
    {
      access_level: 'VIEWER',
      account_email: 'bob@example.com',
      account_id: 'auth0|mynameisbob',
      created: '2023-08-03T15:38:30.206605Z',
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4NXQ68MIDA',
      last_update: '2023-08-03T15:38:30.206611Z',
      project: {
        created: '2015-09-23T21:16:48Z',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgICAgICAgAoM',
        last_update: '2023-08-03T19:02:42.591193Z',
        name: 'My Project',
        org_id: 'abc123',
        system_tags: [],
        tags: ['tag', '2tag'],
      },
    },
    {
      access_level: 'VIEWER',
      account_email: 'alice@example.com',
      account_id: 'auth0|647ljfdgdnhnfjsgzbfdjgjbsnvknsh',
      created: '2023-08-03T15:36:36.746294Z',
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4NWnwe4JDA',
      last_update: '2023-08-03T15:36:36.746301Z',
      project: {
        created: '2015-09-23T21:16:48Z',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgICAgICAgAoM',
        last_update: '2023-08-03T19:02:42.591193Z',
        name: 'My Project',
        org_id: 'abc123',
        system_tags: ['active'],
        tags: [],
      },
    },
    {
      access_level: 'VIEWER',
      account_email: 'dave@example.com',
      account_id: 'auth0|647ljfdgdnhnfjsgzbfdjgjbsnvknsh',
      created: '2023-08-03T15:35:09.014425Z',
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4LX4hb4KDA',
      last_update: '2023-08-03T15:35:09.014433Z',
      project: {
        created: '2015-09-23T21:16:48Z',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgICAgICAgAoM',
        last_update: '2023-08-03T19:02:42.591193Z',
        name: 'My Project',
        org_id: 'a_random_org',
        system_tags: ['active'],
        tags: [],
      },
    },
  ],
};

describe('projects', () => {
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
  const personalProjects = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: ''},
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
      api.get('/api/2/account/projects').reply(200, projects)
    )
    .stdout()
    .command(['projects', '--output=json'])
    .it('Standard columns in JSON', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          created: '2015-09-23T21:16:48Z',
          name: 'My Project',
          tags: 'tag, 2tag',
        },
        {
          created: '2015-09-23T21:16:48Z',
          name: 'My Project',
          tags: 'None',
        },
      ]);
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/account/projects').reply(200, projects)
    )
    .stdout()
    .command(['projects', '--output=json', '-o=a_random_org'])
    .it('Standard columns in JSON passing org ID', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          created: '2015-09-23T21:16:48Z',
          name: 'My Project',
          tags: 'None',
        },
      ]);
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/account/projects').reply(200, projects)
    )
    .stdout()
    .command(['projects', '--output=json', '--columns=System Tags'])
    .it('Parse system tags', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([{systemTags: 'None'}, {systemTags: 'active'}]);
    });

  noOrg
    .stderr()
    .command(['projects'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Current organization not set. Run `apimetrics config org set` first.'
      );
    })
    .it('No organization set');
  personalProjects
    .stderr()
    .command(['projects'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Personal projects not currently supported. Please use web interface instead.'
      );
    })
    .it('Using personal projects');
});
