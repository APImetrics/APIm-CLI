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
      billing_admin_id: null,
      created: '2020-02-14T22:11:51.529661Z',
      enforce_2fa: false,
      id: 'companya',
      kms_enabled: false,
      last_update: '2023-02-09T23:14:01.615261Z',
      name: 'Org with Enterprise contract',
      password_expiry_days: 0,
      subscription_level: 'CONTRACT',
      system_tags: ['subscription_level:CONTRACT', 'active'],
      tags: [],
    },
    companyb: {
      billing_admin_id: 'abc123',
      created: '2016-05-10T23:04:23.798000Z',
      enforce_2fa: false,
      id: 'companyb',
      kms_enabled: false,
      last_update: '2023-10-02T21:31:34.277156Z',
      name: 'An Org',
      password_expiry_days: 0,
      subscription_level: 'PLAN',
      system_tags: ['active', 'subscription_level:PLAN'],
      tags: [],
    },
    companyc: {
      billing_admin_id: 'abc123',
      created: '2016-05-10T23:04:23.798000Z',
      enforce_2fa: false,
      id: 'companyc',
      kms_enabled: false,
      last_update: '2023-10-02T21:31:34.277156Z',
      name: 'Another Org',
      password_expiry_days: 0,
      subscription_level: 'PLAN',
      system_tags: ['active', 'subscription_level:PLAN'],
      tags: [],
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
        mode: 'bearer',
        token: 'abc123',
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
          id: 'companya',
          name: 'Org with Enterprise contract',
          roles: 'DEFAULT',
          subscriptionLevel: 'CONTRACT',
        },
        {
          id: 'companyb',
          name: 'An Org',
          roles: 'DEFAULT, ADMIN',
          subscriptionLevel: 'PLAN',
        },
        {
          id: 'companyc',
          name: 'Another Org',
          roles: '',
          subscriptionLevel: 'PLAN',
        },
      ]);
    });
});
