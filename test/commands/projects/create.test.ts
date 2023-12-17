/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const roles = {
  meta: {},
  results: [
    {
      id: 'A_ROLE',
    },
    {
      id: 'ANOTHER_ROLE',
    },
    {
      id: 'A_THIRD_ROLE',
    },
  ],
};

describe('projects create', () => {
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
    .nock('https://client.apimetrics.io', (api) => {
      api
        .post('/api/2/organizations/abc123/projects/', {name: 'project'})
        .reply(200, {id: 'abc123', name: 'project'})
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles);
    })
    .stdout()
    .command(['projects:create', '--name=project', '--json'])
    .it('Create project basic (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        project: {id: 'abc123', name: 'project'},
        success: true,
        warnings: [],
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .post('/api/2/organizations/def/projects/', {name: 'project'})
        .reply(200, {id: 'abc123', name: 'project'})
        .get('/api/2/organizations/def/roles/')
        .reply(200, roles);
    })
    .stdout()
    .command(['projects:create', '--name=project', '--json', '--org-id=def'])
    .it('Create project basic passing --org-id flag (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        project: {id: 'abc123', name: 'project'},
        success: true,
        warnings: [],
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .post('/api/2/organizations/abc123/projects/', {name: 'project'})
        .reply(200, {id: 'abc123', name: 'project'})
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles);

      // Async requests
      api
        .post('/api/2/projects/abc123/access/', {access_level: 'OWNER', account_id: 'qwerty'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/access/', {access_level: 'EDITOR', account_id: 'qwerty'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/access/', {access_level: 'ANALYST', account_id: 'qwerty'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/access/', {access_level: 'VIEWER', account_id: 'qwerty'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/roles/', {access_level: 'OWNER', role_id: 'A_ROLE'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/roles/', {access_level: 'EDITOR', role_id: 'A_ROLE'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/roles/', {access_level: 'ANALYST', role_id: 'A_ROLE'})
        .reply(200, {});
      api
        .post('/api/2/projects/abc123/roles/', {access_level: 'VIEWER', role_id: 'A_ROLE'})
        .reply(200, {});
    })
    .stdout()
    .command([
      'projects:create',
      '--name=project',
      '--json',
      '--owner-user=qwerty',
      '--editor-user=qwerty',
      '--analyst-user=qwerty',
      '--viewer-user=qwerty',
      '--owner-role=A_ROLE',
      '--editor-role=A_ROLE',
      '--analyst-role=A_ROLE',
      '--viewer-role=A_ROLE',
    ])
    .it('Create project with access and roles (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        project: {id: 'abc123', name: 'project'},
        success: true,
        warnings: [],
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .post('/api/2/organizations/abc123/projects/', {name: 'project'})
        .reply(200, {id: 'abc123', name: 'project'})
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles);
    })
    .stdout()
    .command(['projects:create', '--name=project', '--json', '--viewer-role=AN_INVALID_ROLE'])
    .it('Create project with invalid role (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        project: {id: 'abc123', name: 'project'},
        success: false,
        warnings: ['Unrecognised role AN_INVALID_ROLE. Skipping.'],
      });
    });

  bearerAuth
    .stderr()
    .command(['projects:create'])
    .catch((error) => {
      expect(error.message).to.contain('Missing required flag name');
    })
    .it('Missing required --name flag');

  noOrg
    .stderr()
    .command(['projects:create', '--name=project', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Current organization not set. Run `apimetrics config org set` first.'
      );
    })
    .it('No organization set');
  personalProjects
    .stderr()
    .command(['projects:create', '--name=project', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Personal projects not currently supported. Please use web interface instead.'
      );
    })
    .it('Using personal projects');
});
