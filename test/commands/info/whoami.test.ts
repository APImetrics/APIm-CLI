/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const userinfo = {
  email: 'bob@example.com',
  email_verified: false,
  'https://client.apimetrics.io/fav_orgs': [],
  'https://client.apimetrics.io/fav_projects': [],
  'https://client.apimetrics.io/org_ids': ['companya'],
  'https://client.apimetrics.io/permissions': [],
  'https://client.apimetrics.io/roles': {
    companya: ['DEFAULT'],
  },
  'https://client.apimetrics.io/use_mfa': false,
  name: 'bob@example.com',
  nickname: 'Bob',
  picture: 'https://s.gravatar.com/avatar/abc123',
  sub: 'auth0|109e70845ef23eb4099c209p',
  updated_at: '2023-10-12T19:00:00.589Z',
};

const project = {
  name: 'A Project',
};

describe('info whoami', () => {
  const bearerAuth = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: 'companya'},
        project: {current: 'ag9zfmFwaWasfHJpY3MtclpsEQsSBFVzZyu;gIDgpdG73QoM'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        mode: 'bearer',
        token: 'abc123',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'})
    .env({APIMETRICS_USERINFO_URL: 'https://auth.apimetrics.io/userinfo'});

  const noProject = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: 'companya'},
        project: {current: ''},
      });
      fs.writeJsonSync('./.test/auth.json', {
        mode: 'bearer',
        token: 'abc123',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'})
    .env({APIMETRICS_USERINFO_URL: 'https://auth.apimetrics.io/userinfo'});

  bearerAuth
    .nock('https://auth.apimetrics.io', (api) => api.get('/userinfo').reply(200, userinfo))
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/projects/ag9zfmFwaWasfHJpY3MtclpsEQsSBFVzZyu;gIDgpdG73QoM')
        .reply(200, project)
    )
    .stdout()
    .command(['info:whoami'])
    .it('Show current user information', (ctx) => {
      expect(ctx.stdout).to.equal(`ID:                   auth0|109e70845ef23eb4099c209p
Name:                 Bob
Email:                bob@example.com
MFA enabled:          false
Current Organization: companya
Current Project Name: A Project
Current Project ID:   ag9zfmFwaWasfHJpY3MtclpsEQsSBFVzZyu;gIDgpdG73QoM
`);
    });
  noProject
    .nock('https://auth.apimetrics.io', (api) => api.get('/userinfo').reply(200, userinfo))

    .stdout()
    .command(['info:whoami'])
    .it('Show current user information', (ctx) => {
      expect(ctx.stdout).to.equal(`ID:                   auth0|109e70845ef23eb4099c209p
Name:                 Bob
Email:                bob@example.com
MFA enabled:          false
Current Organization: companya
Current Project Name: \nCurrent Project ID:   \n`); // Whitespace important here
    });
});
