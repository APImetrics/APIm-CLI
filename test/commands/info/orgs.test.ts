/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const orgs = {
  meta: {
    roles: {
      companya: ['DEFAULT'],
      companyb: ['DEFAULT', 'ADMIN'],
    },
  },
  organizations: {
    companya: {
      enforce_2fa: false,
      tags: [],
      password_expiry_days: 0,
      system_tags: ['subscription_level:CONTRACT', 'active'],
      billing_admin_id: null,
      kms_enabled: false,
      created: '2020-02-14T22:11:51.529661Z',
      subscription_level: 'CONTRACT',
      last_update: '2023-02-09T23:14:01.615261Z',
      id: 'companya',
      name: 'Org with Enterprise contract',
    },
    companyb: {
      enforce_2fa: false,
      tags: [],
      password_expiry_days: 0,
      system_tags: ['active', 'subscription_level:PLAN'],
      billing_admin_id: 'abc123',
      kms_enabled: false,
      created: '2016-05-10T23:04:23.798000Z',
      subscription_level: 'PLAN',
      last_update: '2023-10-02T21:31:34.277156Z',
      id: 'companyb',
      name: 'An Org',
    },
    companyc: {
      enforce_2fa: false,
      tags: [],
      password_expiry_days: 0,
      system_tags: ['active', 'subscription_level:PLAN'],
      billing_admin_id: 'abc123',
      kms_enabled: false,
      created: '2016-05-10T23:04:23.798000Z',
      subscription_level: 'PLAN',
      last_update: '2023-10-02T21:31:34.277156Z',
      id: 'companyc',
      name: 'Another Org',
    },
  },
};

describe('info orgs', () => {
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
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/account/projects').reply(200, orgs)
    )
    .stdout()
    .command(['info:orgs', '--output=json'])
    .it('List all orgs with --output=json argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          name: 'Org with Enterprise contract',
          id: 'companya',
          roles: 'DEFAULT',
          subscriptionLevel: 'CONTRACT',
        },
        {
          name: 'An Org',
          id: 'companyb',
          roles: 'DEFAULT, ADMIN',
          subscriptionLevel: 'PLAN',
        },
        {
          name: 'Another Org',
          id: 'companyc',
          roles: '',
          subscriptionLevel: 'PLAN',
        },
      ]);
    });
});
