/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const projectAccess = {
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
      access_level: 'ANALYST',
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
      access_level: 'EDITOR',
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
      access_level: 'OWNER',
      account_email: 'charlotte@example.com',
      created: '2023-08-03T15:36:49.567772Z',
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4KX0xcgKDA',
      account_id: 'auth0|abc123',
      last_update: '2023-08-03T15:36:49.567778Z',
    },
  ],
};

const orgAccounts = {
  meta: {},
  results: [
    {email: 'abc@example.com', id: 'auth0|abc123'},
    {email: 'def@example.com', id: 'auth0|def123'},
    {email: 'ghi@example.com', id: 'auth0|ghi123'},
    {email: 'jkl@example.com', id: 'auth0|jkl123'},
    {email: 'mno@example.com', id: 'auth0|mno123'},
    {email: 'pqr@example.com', id: 'auth0|pqr123'},
    {email: 'stu@example.com', id: 'auth0|stu123'},
    {email: 'vwx@example.com', id: 'auth0|vwx123'},
    {email: 'yza@example.com', id: 'auth0|yza123'},
    {email: 'yza@example.com', id: 'auth0|yza123'},
  ],
};

describe('project accounts edit', () => {
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
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/organizations/abc123/accounts/')
        .reply(200, orgAccounts)
        .get('/api/2/projects/abc123/access/')
        .reply(200, projectAccess);
      api
        .post('/api/2/projects/abc123/access/', {access_level: 'OWNER', account_id: 'abc123'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/access/', {access_level: 'EDITOR', account_id: 'abc123'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/access/', {access_level: 'ANALYST', account_id: 'abc123'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/access/', {access_level: 'VIEWER', account_id: 'abc123'})
        .reply(200, {});
    })
    .stdout()
    .command([
      'projects:accounts:edit',
      '--add-owner=abc123',
      '--add-editor=abc123',
      '--add-analyst=abc123',
      '--add-viewer=abc123',
      '--json',
    ])
    .it('Add user roles', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true, warnings: []});
    });


  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/organizations/abc123/accounts/')
        .reply(200, orgAccounts)
        .get('/api/2/projects/abc123/access/')
        .reply(200, projectAccess);
      api
        .post('/api/2/projects/abc123/access/', {access_level: 'OWNER', account_id: 'auth0|def123'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/access/', {access_level: 'EDITOR', account_id: 'abc123'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/access/', {access_level: 'ANALYST', account_id: 'abc123'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/access/', {
          access_level: 'VIEWER',
          account_id: 'auth0|abc123',
        })
        .reply(200, {});
    })
    .stdout()
    .command([
      'projects:accounts:edit',
      '--add-owner=def@example.com',
      '--add-editor=abc123',
      '--add-analyst=abc123',
      '--add-viewer=abc@example.com',
      '--json',
    ])
    .it('Add user roles specifying by email', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true, warnings: []});
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/organizations/abc123/accounts/')
        .reply(200, orgAccounts)
        .get('/api/2/projects/abc123/access/')
        .reply(200, projectAccess);
      api
        .delete(
          '/api/2/projects/abc123/access/ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4NXQ68MIDA/'
        )
        .reply(200, {});
      api
        .delete(
          '/api/2/projects/abc123/access/ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4NWnwe4JDA/'
        )
        .reply(200, {});
      api
        .delete(
          '/api/2/projects/abc123/access/ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4LX4hb4KDA/'
        )
        .reply(200, {});
      api
        .delete(
          '/api/2/projects/abc123/access/ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4KX0xcgKDA/'
        )
        .reply(200, {});
    })
    .stdout()
    .command([
      'projects:accounts:edit',
      '--remove-owner=auth0|abc123',
      '--remove-editor=auth0|647ljfdgdnhnfjsgzbfdjgjbsnvknsh',
      '--remove-analyst=auth0|647ljfdgdnhnfjsgzbfdjgjbsnvknsh',
      '--remove-viewer=auth0|mynameisbob',
      '--json',
    ])
    .it('Remove user roles', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true, warnings: []});
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/organizations/abc123/accounts/')
        .reply(200, orgAccounts)
        .get('/api/2/projects/abc123/access/')
        .reply(200, projectAccess);
      api
        .delete(
          '/api/2/projects/abc123/access/ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4NXQ68MIDA/'
        )
        .reply(200, {});
      api
        .delete(
          '/api/2/projects/abc123/access/ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4NWnwe4JDA/'
        )
        .reply(200, {});
      api
        .delete(
          '/api/2/projects/abc123/access/ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4LX4hb4KDA/'
        )
        .reply(200, {});
      api
        .delete(
          '/api/2/projects/abc123/access/ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4KX0xcgKDA/'
        )
        .reply(200, {});
    })
    .stdout()
    .command([
      'projects:accounts:edit',
      '--remove-owner=abc@example.com',
      '--remove-editor=auth0|647ljfdgdnhnfjsgzbfdjgjbsnvknsh',
      '--remove-analyst=auth0|647ljfdgdnhnfjsgzbfdjgjbsnvknsh',
      '--remove-viewer=auth0|mynameisbob',
      '--json',
    ])
    .it('Remove user roles by email', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true, warnings: []});
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/organizations/abc123/accounts/')
        .reply(200, orgAccounts)
        .get('/api/2/projects/abc123/access/')
        .reply(200, projectAccess);
    })
    .stderr()
    .stdout()
    .command(['projects:accounts:edit', '--remove-owner=auth0|qwerty', '--json'])
    .it('Remove user roles with non-existent user', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: false,
        warnings: ['Could not find account with ID auth0|qwerty for access level OWNER. Skipping.'],
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/project/')
        .reply(200, {org_id: 'def'})
        .get('/api/2/organizations/def/accounts/')
        .reply(200, orgAccounts)
        .get('/api/2/projects/qwerty/access/')
        .reply(200, projectAccess);
      api
        .delete(
          '/api/2/projects/qwerty/access/ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4NXQ68MIDA/'
        )
        .reply(200, {});
      api
        .delete(
          '/api/2/projects/qwerty/access/ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4NWnwe4JDA/'
        )
        .reply(200, {});
      api
        .delete(
          '/api/2/projects/qwerty/access/ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4LX4hb4KDA/'
        )
        .reply(200, {});
      api
        .delete(
          '/api/2/projects/qwerty/access/ag9zfmFwaW1ldHJpY3MtcWNyGwsSDkFjY291bnRQcm9qZWN0GICA4KX0xcgKDA/'
        )
        .reply(200, {});
    })
    .stdout()
    .command([
      'projects:accounts:edit',
      '--project-id=qwerty',
      '--remove-owner=auth0|abc123',
      '--remove-editor=auth0|647ljfdgdnhnfjsgzbfdjgjbsnvknsh',
      '--remove-analyst=auth0|647ljfdgdnhnfjsgzbfdjgjbsnvknsh',
      '--remove-viewer=auth0|mynameisbob',
      '--json',
    ])
    .it('Pass project ID as argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true, warnings: []});
    });

  test
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
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'})
    .stderr()
    .command(['projects:accounts:edit', '--remove-owner=auth0|qwerty', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Current organization not set. Run `apimetrics config org set` first.'
      );
    })
    .it('No organisation set');

  test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: ''},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'bearer',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'})
    .stderr()
    .command(['projects:accounts:edit', '--remove-owner=auth0|qwerty', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Personal projects not currently supported. Please use web interface instead.'
      );
    })
    .it('Personal projects');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/organizations/abc123/accounts/').reply(200, orgAccounts);
    })
    .stderr()
    .command(['projects:accounts:edit', '--add-owner=yza@example.com', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'There are multiple users with the email yza@example.com. Please use their ID instead.'
      );
    })
    .it('Multiple users with the same email');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/organizations/abc123/accounts/').reply(200, orgAccounts);
    })
    .stderr()
    .command(['projects:accounts:edit', '--add-owner=qwerty@example.com', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'No users with the email qwerty@example.com exist. Please use their ID instead.'
      );
    })
    .it('No user with email');
});
