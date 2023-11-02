import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

describe('projects delete', () => {
  const auth = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: 'abc123'},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'device',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});

  const noProject = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: 'abc123'},
        project: {},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'device',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});

  const noOrg = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {},
        project: {},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'device',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});

  const personalProject = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: ''},
        project: {},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'device',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/projects/abc123/roles/')
        .reply(200, {meta: {}, results: []})
        .get('/api/2/projects/abc123/access/')
        .reply(200, {meta: {}, results: []})
        .delete('/api/2/organizations/abc123/projects/abc123/')
        .reply(200, {})
    )
    .stdout()
    .command(['projects:delete'])
    .it('Delete current working project', (ctx) => {
      expect(ctx.stdout).to.contain(
        'Deleted current working project. You will need to run `apimetrics config project set`.'
      );
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/projects/abc456/roles/')
        .reply(200, {meta: {}, results: []})
        .get('/api/2/projects/abc456/access/')
        .reply(200, {meta: {}, results: []})
        .delete('/api/2/organizations/abc123/projects/abc456/')
        .reply(200, {})
    )
    .stdout()
    .command(['projects:delete', '-p=abc456'])
    .it('Delete project');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/projects/abc456/roles/')
        .reply(200, {meta: {}, results: []})
        .get('/api/2/projects/abc456/access/')
        .reply(200, {meta: {}, results: []})
        .delete('/api/2/organizations/def/projects/abc456/')
        .reply(200, {})
    )
    .stdout()
    .command(['projects:delete', '-p=abc456', '-o=def'])
    .it('Delete project passing org ID');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/projects/abc123/roles/').reply(200, {meta: {}, results: ['']})
    )
    .stdout()
    .command(['projects:delete'])
    .catch((error) => {
      expect(error.message).to.contain(
        'There is 1 role currently with access to this project. Please remove all roles before deleting the project.'
      );
    })
    .it('Delete project with role');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/projects/abc123/roles/').reply(200, {meta: {}, results: ['', '', '']})
    )
    .stdout()
    .command(['projects:delete'])
    .catch((error) => {
      expect(error.message).to.contain(
        'There are 3 roles currently with access to this project. Please remove all roles before deleting the project.'
      );
    })
    .it('Delete project with multiple roles');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/projects/abc123/roles/')
        .reply(200, {meta: {}, results: []})
        .get('/api/2/projects/abc123/access/')
        .reply(200, {meta: {}, results: ['']})
    )
    .stdout()
    .command(['projects:delete'])
    .catch((error) => {
      expect(error.message).to.contain(
        'There is 1 account currently with access to this project. Please remove all accounts before deleting the project.'
      );
    })
    .it('Delete project with account');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/projects/abc123/roles/')
        .reply(200, {meta: {}, results: []})
        .get('/api/2/projects/abc123/access/')
        .reply(200, {meta: {}, results: ['', '', '']})
    )
    .stdout()
    .command(['projects:delete'])
    .catch((error) => {
      expect(error.message).to.contain(
        'There are 3 accounts currently with access to this project. Please remove all accounts before deleting the project.'
      );
    })
    .it('Delete project with multiple accounts');

  noProject
    .stderr()
    .command(['projects:delete'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Current working project not set. Run `apimetrics config project set` first.'
      );
    })
    .it('No project set');

  noOrg
    .stderr()
    .command(['projects:delete'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Current organization not set. Run `apimetrics config org set` first.'
      );
    })
    .it('No org set');

  personalProject
    .stderr()
    .command(['projects:delete'])
    .catch((error) => {
      expect(error.message).to.contain('Personal projects not currently supported.');
    })
    .it('Personal projects');
});
