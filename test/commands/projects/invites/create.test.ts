/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

describe('projects invites create', () => {
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
  const noProject = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {},
        project: {},
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
        .post('/api/2/projects/abc123/invites/', {email: 'bob@example.com', access_level: 'OWNER'})
        .reply(200, {id: 'cde456'});
    })
    .stdout()
    .command([
      'projects:invites:create',
      '--email=bob@example.com',
      '--access-level=owner',
      '--json',
    ])
    .it('Create invite (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        invite: {id: 'cde456'},
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .post('/api/2/projects/def/invites/', {email: 'bob@example.com', access_level: 'OWNER'})
        .reply(200, {id: 'cde456'});
    })
    .stdout()
    .command([
      'projects:invites:create',
      '-p=def',
      '--email=bob@example.com',
      '--access-level=owner',
      '--json',
    ])
    .it('Create invite passing --project-id flag (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        invite: {id: 'cde456'},
      });
    });

  bearerAuth
    .stderr()
    .command(['projects:invites:create', '--email=qwerty', '--access-level=owner'])
    .catch((error) => {
      expect(error.message).to.contain('Invalid email: qwerty.');
    })
    .it('Invalid email');

  bearerAuth
    .stderr()
    .command(['projects:invites:create'])
    .catch((error) => {
      expect(error.message)
        .to.contain('Missing required flag email')
        .and.to.contain('Missing required flag access-level');
    })
    .it('Check required flags');

  noProject
    .stderr()
    .command([
      'projects:invites:create',
      '--email=dave@example.com',
      '--access-level=owner',
      '--json',
    ])
    .catch((error) => {
      expect(error.message).to.contain(
        'Current working project not set. Run `apimetrics config project set` first.'
      );
    })
    .it('No project set');
});
