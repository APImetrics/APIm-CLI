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
      api.get('/api/2/organizations/abc123/roles/').reply(200, roles);

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
    .it('Add and remove roles from a user (--json)', (ctx) => {
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
      api.get('/api/2/organizations/abc123/roles/').reply(200, roles);
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
      api.get('/api/2/organizations/def/roles/').reply(200, roles);

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
      api.get('/api/2/organizations/abc123/roles/').reply(200, roles);
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
    .it('Add invalid role');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/organizations/abc123/roles/').reply(200, roles);
    })
    .stderr()
    .command([
      'org:accounts:edit',
      '--add-role=A_ROLE',
      '--remove-role=AN_INVALID_ROLE',
      '--user-id=qwerty',
    ])
    .catch((error) => {
      expect(error.message).to.contain('Unrecognized role AN_INVALID_ROLE');
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
