/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const userinfo = {
  sub: 'auth0|109e70845ef23eb4099c209p',
  nickname: 'Bob',
  name: 'bob@example.com',
  picture: 'https://s.gravatar.com/avatar/abc123',
  updated_at: '2023-10-12T19:00:00.589Z',
  email: 'bob@example.com',
  email_verified: false,
  'https://client.apimetrics.io/org_ids': ['companya'],
  'https://client.apimetrics.io/roles': {
    companya: ['DEFAULT'],
  },
  'https://client.apimetrics.io/permissions': [],
  'https://client.apimetrics.io/use_mfa': false,
  'https://client.apimetrics.io/fav_orgs': [],
  'https://client.apimetrics.io/fav_projects': [],
};

describe('info whoami', () => {
  const bearerAuth = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: 'companya'},
        project: {current: 'ag9zfmFwaWasfHJpY3MtclpsEQsSBFVzZyu;gIDgpdG73QoM'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'bearer',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_USERINFO_URL: 'https://auth.apimetrics.io/userinfo'});

  bearerAuth
    .nock('https://auth.apimetrics.io', (api) => api.get('/userinfo').reply(200, userinfo))
    .stdout()
    .command(['info:whoami'])
    .it('Show current user information', (ctx) => {
      expect(ctx.stdout).to.equal(`ID:                   auth0|109e70845ef23eb4099c209p
Name:                 Bob
Email:                bob@example.com
MFA enabled:          false
Current Organization: companya
Current Project:      ag9zfmFwaWasfHJpY3MtclpsEQsSBFVzZyu;gIDgpdG73QoM`);
    });
});
