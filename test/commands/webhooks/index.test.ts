/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const webhooks = {
  meta: {},
  results: [
    {
      meta: {
        name: 'A Webhook',
        include_tags: ['tag', 'tag'],
        exclude_tags: ['tag', 'tag'],
        tags: ['tag', 'tag'],
      },
      webhook: {
        type: 'email',
        enabled: true,
        parameters: {
          email_address: 'bob@example.com',
        },
      },
    },
    {
      meta: {
        name: 'A Webhook',
        include_tags: [],
        exclude_tags: [],
        tags: [],
      },
      webhook: {
        type: 'email',
        enabled: true,
        parameters: {},
      },
    },
    {
      meta: {
        name: 'A Webhook',
        include_tags: [],
        exclude_tags: [],
      },
      webhook: {
        type: 'email',
        enabled: true,
        parameters: {},
      },
    },
  ],
};

describe('webhooks', () => {
  const auth = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: 'abc123'},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'key',
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
        mode: 'key',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});

  auth
    .nock('https://client.apimetrics.io', (api) => api.get('/api/2/webhooks/').reply(200, webhooks))
    .stdout()
    .command(['webhooks', '--output=json'])
    .it('List all webhooks with --output=json argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          name: 'A Webhook',
          type: 'email',
          includeTags: 'tag, tag',
          excludeTags: 'tag, tag',
          enabled: 'true',
        },
        {
          name: 'A Webhook',
          type: 'email',
          includeTags: 'None',
          excludeTags: 'None',
          enabled: 'true',
        },
        {
          name: 'A Webhook',
          type: 'email',
          includeTags: 'None',
          excludeTags: 'None',
          enabled: 'true',
        },
      ]);
    });

  auth
    .nock('https://client.apimetrics.io', (api) => api.get('/api/2/webhooks/').reply(200, webhooks))
    .stdout()
    .command(['webhooks', '--output=json', '--columns=parameters,tags'])
    .it('Check paramater and tag formatting', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          parameters: 'email_address: bob@example.com',
          tags: 'tag, tag',
        },
        {
          parameters: '',
          tags: 'None',
        },
        {
          parameters: '',
          tags: 'None',
        },
      ]);
    });

  noProject
    .nock(
      'https://client.apimetrics.io',
      {reqheaders: {'Apimetrics-Project-Id': (val) => val === '123'}},
      (api) => api.get('/api/2/webhooks/').reply(200, webhooks)
    )
    .stdout()
    .command(['webhooks', '--output=json', '-p=123'])
    .it('Pass project ID inline', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          name: 'A Webhook',
          type: 'email',
          includeTags: 'tag, tag',
          excludeTags: 'tag, tag',
          enabled: 'true',
        },
        {
          name: 'A Webhook',
          type: 'email',
          includeTags: 'None',
          excludeTags: 'None',
          enabled: 'true',
        },
        {
          name: 'A Webhook',
          type: 'email',
          includeTags: 'None',
          excludeTags: 'None',
          enabled: 'true',
        },
      ]);
    });
});
