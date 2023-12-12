/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const project = {
  org_id: 'abc123',
};

const roles = {
  meta: {},
  results: [{id: 'A_ROLE'}, {id: 'ANOTHER_ROLE'}],
};

const access = {
  meta: {},
  results: [
    {
      access_level: 'OWNER',
      id: 'role1',
      role_id: 'A_ROLE',
    },
    {
      access_level: 'EDITOR',
      id: 'role2',
      role_id: 'A_ROLE',
    },
    {
      access_level: 'ANALYST',
      id: 'role3',
      role_id: 'A_ROLE',
    },
    {
      access_level: 'VIEWER',
      id: 'role4',
      role_id: 'A_ROLE',
    },
  ],
};

describe('project roles edit', () => {
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
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/projects/abc123')
        .reply(200, project)
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles)
        .get('/api/2/projects/abc123/roles/')
        .reply(200, access);
      api
        .post('/api/2/projects/abc123/roles/', {access_level: 'OWNER', role_id: 'A_ROLE'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/roles/', {access_level: 'EDITOR', role_id: 'ANOTHER_ROLE'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/roles/', {access_level: 'ANALYST', role_id: 'A_ROLE'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/roles/', {access_level: 'VIEWER', role_id: 'ANOTHER_ROLE'})
        .reply(200, {});
    })
    .stdout()
    .command([
      'projects:roles:edit',
      '--add-owner=A_ROLE',
      '--add-editor=ANOTHER_ROLE',
      '--add-analyst=A_ROLE',
      '--add-viewer=ANOTHER_ROLE',
      '--json',
    ])
    .it('Add roles', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true, warnings: []});
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/projects/abc123')
        .reply(200, project)
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles)
        .get('/api/2/projects/abc123/roles/')
        .reply(200, access);
      api.delete('/api/2/projects/abc123/roles/role1/').reply(200, {});
      api.delete('/api/2/projects/abc123/roles/role2/').reply(200, {});
      api.delete('/api/2/projects/abc123/roles/role3/').reply(200, {});
      api.delete('/api/2/projects/abc123/roles/role4/').reply(200, {});
    })
    .stdout()
    .command([
      'projects:roles:edit',
      '--remove-owner=A_ROLE',
      '--remove-editor=A_ROLE',
      '--remove-analyst=A_ROLE',
      '--remove-viewer=A_ROLE',
      '--json',
    ])
    .it('Remove roles', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true, warnings: []});
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/projects/abc123')
        .reply(200, project)
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles)
        .get('/api/2/projects/abc123/roles/')
        .reply(200, access);
    })
    .stderr()
    .stdout()
    .command(['projects:roles:edit', '--remove-owner=A_RANDOM_ROLE', '--json'])
    .it('Remove non-existent role', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: false,
        warnings: ['Could not find role with ID A_RANDOM_ROLE for access level OWNER. Skipping.'],
      });
    });
  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/projects/abc123')
        .reply(200, project)
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles)
        .get('/api/2/projects/abc123/roles/')
        .reply(200, access);
    })
    .stderr()
    .stdout()
    .command(['projects:roles:edit', '--add-owner=A_RANDOM_ROLE', '--json'])
    .it('Add non-existent role', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: false,
        warnings: ['Could not find role with ID A_RANDOM_ROLE. Skipping.'],
      });
    });
  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/projects/def')
        .reply(200, project)
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles)
        .get('/api/2/projects/def/roles/')
        .reply(200, access);
      api.delete('/api/2/projects/def/roles/role1/').reply(200, {});
      api.delete('/api/2/projects/def/roles/role2/').reply(200, {});
      api.delete('/api/2/projects/def/roles/role3/').reply(200, {});
      api.delete('/api/2/projects/def/roles/role4/').reply(200, {});
    })
    .stdout()
    .command([
      'projects:roles:edit',
      '-p=def',
      '--remove-owner=A_ROLE',
      '--remove-editor=A_ROLE',
      '--remove-analyst=A_ROLE',
      '--remove-viewer=A_ROLE',
      '--json',
    ])
    .it('Pass project ID', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true, warnings: []});
    });
});
