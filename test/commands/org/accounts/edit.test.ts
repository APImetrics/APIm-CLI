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

const appMetadataOrgRoles = {
  name: 'Bob',
  email: 'bob@example.com',
  last_login: '2021-09-01T05:23:20.337Z',
  last_ip: '123.123.123.123',
  logins_count: 2,
  app_metadata: {
    org_roles: {
      abc123: ['DEFAULT', 'DAVE', 'ANOTHER_ROLE'],
    },
  },
};
const appMetadata = {
  name: 'Dave',
  email: 'dave@example.com',
  last_login: '2021-09-01T05:23:20.337Z',
  last_ip: '123.123.123.123',
  logins_count: 2,
  app_metadata: {
    abc123: ['DEFAULT', 'DAVE', 'ANOTHER_ROLE'],
  },
};
const permissions = {
  name: 'Alice',
  email: 'alice@example.com',
  last_login: '2021-09-01T05:23:20.337Z',
  last_ip: '123.123.123.123',
  logins_count: 2,
  permissions: ['DEFAULT', 'DAVE', 'ANOTHER_ROLE'],
};

const emptyAppMetadata = {
  name: 'Fred',
  email: 'fred@example.com',
  last_login: '2021-09-01T05:23:20.337Z',
  last_ip: '123.123.123.123',
  logins_count: 2,
  app_metadata: {},
};

const noRoles = {
  name: 'Fred',
  email: 'fred@example.com',
  last_login: '2021-09-01T05:23:20.337Z',
  last_ip: '123.123.123.123',
  logins_count: 2,
};

describe('org accounts edit', () => {
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
  const personalProjects = test
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
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles)
        .get('/api/2/organizations/abc123/accounts/qwerty')
        .reply(200, appMetadata);

      // These calls are async
      api.post('/api/2/organizations/abc123/accounts/qwerty/role/A_ROLE/').reply(200, {});
      api.delete('/api/2/organizations/abc123/accounts/qwerty/role/ANOTHER_ROLE/').reply(200, {});
    })
    .stdout()
    .command([
      'org:accounts:edit',
      '--add-role=A_ROLE',
      '--remove-role=ANOTHER_ROLE',
      '--user-id=qwerty',
      '--json',
    ])
    .it('Add and remove roles from a user with role in app_metadata (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true});
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles)
        .get('/api/2/organizations/abc123/accounts/qwerty')
        .reply(200, appMetadataOrgRoles);

      // These calls are async
      api.post('/api/2/organizations/abc123/accounts/qwerty/role/A_ROLE/').reply(200, {});
      api.delete('/api/2/organizations/abc123/accounts/qwerty/role/ANOTHER_ROLE/').reply(200, {});
    })
    .stdout()
    .command([
      'org:accounts:edit',
      '--add-role=A_ROLE',
      '--remove-role=ANOTHER_ROLE',
      '--user-id=qwerty',
      '--json',
    ])
    .it('Add and remove roles from a user with role in app_metadata.org_roles (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true});
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles)
        .get('/api/2/organizations/abc123/accounts/qwerty')
        .reply(200, permissions);

      // These calls are async
      api.post('/api/2/organizations/abc123/accounts/qwerty/role/A_ROLE/').reply(200, {});
      api.delete('/api/2/organizations/abc123/accounts/qwerty/role/ANOTHER_ROLE/').reply(200, {});
    })
    .stdout()
    .command([
      'org:accounts:edit',
      '--add-role=A_ROLE',
      '--remove-role=ANOTHER_ROLE',
      '--user-id=qwerty',
      '--json',
    ])
    .it('Add and remove roles from a user with role in permissions (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true});
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/organizations/abc123/roles/').reply(200, roles);
      api.post('/api/2/organizations/abc123/accounts/qwerty/role/A_ROLE/').reply(200, {});
    })
    .stdout()
    .command(['org:accounts:edit', '--add-role=A_ROLE', '--user-id=qwerty', '--json'])
    .it('Add role to a user (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true});
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles)
        .get('/api/2/organizations/abc123/accounts/qwerty')
        .reply(200, appMetadataOrgRoles);
      api.delete('/api/2/organizations/abc123/accounts/qwerty/role/ANOTHER_ROLE/').reply(200, {});
    })
    .stdout()
    .command(['org:accounts:edit', '--remove-role=ANOTHER_ROLE', '--user-id=qwerty', '--json'])
    .it('Remove role from a user (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true});
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/organizations/def/roles/')
        .reply(200, roles)
        .get('/api/2/organizations/def/accounts/qwerty')
        .reply(200, permissions);

      // These calls are async
      api.post('/api/2/organizations/def/accounts/qwerty/role/A_ROLE/').reply(200, {});
      api.delete('/api/2/organizations/def/accounts/qwerty/role/ANOTHER_ROLE/').reply(200, {});
    })
    .stdout()
    .command([
      'org:accounts:edit',
      '--org-id=def',
      '--add-role=A_ROLE',
      '--remove-role=ANOTHER_ROLE',
      '--user-id=qwerty',
      '--json',
    ])
    .it('Add and remove roles from a user specifying --org-id (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({success: true});
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles)
        .get('/api/2/organizations/abc123/accounts/qwerty')
        .reply(200, noRoles);
    })
    .stderr()
    .command([
      'org:accounts:edit',
      '--add-role=AN_INVALID_ROLE',
      '--remove-role=ANOTHER_ROLE',
      '--user-id=qwerty',
    ])
    .catch((error) => {
      expect(error.message).to.contain('Unrecognized role AN_INVALID_ROLE');
    })
    .it('Add invalid role no role data');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles)
        .get('/api/2/organizations/abc123/accounts/qwerty')
        .reply(200, emptyAppMetadata);
    })
    .stderr()
    .command([
      'org:accounts:edit',
      '--add-role=AN_INVALID_ROLE',
      '--remove-role=ANOTHER_ROLE',
      '--user-id=qwerty',
    ])
    .catch((error) => {
      expect(error.message).to.contain('Unrecognized role AN_INVALID_ROLE');
    })
    .it('Add invalid role empty app metadata');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/organizations/abc123/roles/')
        .reply(200, roles)
        .get('/api/2/organizations/abc123/accounts/qwerty')
        .reply(200, appMetadataOrgRoles);
    })
    .stderr()
    .command([
      'org:accounts:edit',
      '--add-role=A_ROLE',
      '--remove-role=AN_INVALID_ROLE',
      '--user-id=qwerty',
    ])
    .catch((error) => {
      expect(error.message).to.contain('AN_INVALID_ROLE not found on user qwerty.');
    })
    .it('Remove invalid role');

  noOrg
    .stderr()
    .command([
      'org:accounts:edit',
      '--add-role=A_ROLE',
      '--remove-role=ANOTHER_ROLE',
      '--user-id=qwerty',
      '--json',
    ])
    .catch((error) => {
      expect(error.message).to.contain(
        'Current organization not set. Run `apimetrics config org set` first.'
      );
    })
    .it('No organization set');
  personalProjects
    .stderr()
    .command([
      'org:accounts:edit',
      '--add-role=A_ROLE',
      '--remove-role=ANOTHER_ROLE',
      '--user-id=qwerty',
      '--json',
    ])
    .catch((error) => {
      expect(error.message).to.contain(
        'Personal projects not currently supported. Please use web interface instead.'
      );
    })
    .it('Using personal projects');
});
