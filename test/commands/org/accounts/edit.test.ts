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
  app_metadata: {
    org_roles: {
      abc123: ['DEFAULT', 'DAVE', 'ANOTHER_ROLE'],
    },
  },
  email: 'bob@example.com',
  last_ip: '123.123.123.123',
  last_login: '2021-09-01T05:23:20.337Z',
  logins_count: 2,
  name: 'Bob',
};
const appMetadata = {
  app_metadata: {
    abc123: ['DEFAULT', 'DAVE', 'ANOTHER_ROLE'],
  },
  email: 'dave@example.com',
  last_ip: '123.123.123.123',
  last_login: '2021-09-01T05:23:20.337Z',
  logins_count: 2,
  name: 'Dave',
};
const permissions = {
  email: 'alice@example.com',
  last_ip: '123.123.123.123',
  last_login: '2021-09-01T05:23:20.337Z',
  logins_count: 2,
  name: 'Alice',
  permissions: ['DEFAULT', 'DAVE', 'ANOTHER_ROLE'],
};

const emptyAppMetadata = {
  app_metadata: {},
  email: 'fred@example.com',
  last_ip: '123.123.123.123',
  last_login: '2021-09-01T05:23:20.337Z',
  logins_count: 2,
  name: 'Fred',
};

const noRoles = {
  email: 'fred@example.com',
  last_ip: '123.123.123.123',
  last_login: '2021-09-01T05:23:20.337Z',
  logins_count: 2,
  name: 'Fred',
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

describe('org accounts edit', () => {
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
        .get('/api/2/organizations/abc123/accounts/')
        .reply(200, orgAccounts)
        .get('/api/2/organizations/abc123/accounts/auth0%7Cabc123')
        .reply(200, appMetadata);

      // These calls are async
      api.post('/api/2/organizations/abc123/accounts/auth0%7Cabc123/role/A_ROLE/').reply(200, {});
      api
        .delete('/api/2/organizations/abc123/accounts/auth0%7Cabc123/role/ANOTHER_ROLE/')
        .reply(200, {});
    })
    .stdout()
    .command([
      'org:accounts:edit',
      '--add-role=A_ROLE',
      '--remove-role=ANOTHER_ROLE',
      '--user-id=abc@example.com',
      '--json',
    ])
    .it('Add and remove roles from a user using email', (ctx) => {
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
