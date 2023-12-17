/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const webhooks = {
  meta: {},
  results: [
    {
      meta: {
        exclude_tags: ['tag', 'tag'],
        include_tags: ['tag', 'tag'],
        name: 'A Webhook',
        tags: ['tag', 'tag'],
      },
      webhook: {
        enabled: true,
        parameters: {
          email_address: 'bob@example.com',
        },
        type: 'email',
      },
    },
    {
      meta: {
        exclude_tags: [],
        include_tags: [],
        name: 'A Webhook',
        tags: [],
      },
      webhook: {
        enabled: true,
        parameters: {},
        type: 'email',
      },
    },
    {
      meta: {
        exclude_tags: [],
        include_tags: [],
        name: 'A Webhook',
      },
      webhook: {
        enabled: true,
        parameters: {},
        type: 'email',
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
        mode: 'key',
        token: 'abc123',
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
        mode: 'key',
        token: 'abc123',
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
          enabled: 'true',
          excludeTags: 'tag, tag',
          includeTags: 'tag, tag',
          name: 'A Webhook',
          type: 'email',
        },
        {
          enabled: 'true',
          excludeTags: 'None',
          includeTags: 'None',
          name: 'A Webhook',
          type: 'email',
        },
        {
          enabled: 'true',
          excludeTags: 'None',
          includeTags: 'None',
          name: 'A Webhook',
          type: 'email',
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
          enabled: 'true',
          excludeTags: 'tag, tag',
          includeTags: 'tag, tag',
          name: 'A Webhook',
          type: 'email',
        },
        {
          enabled: 'true',
          excludeTags: 'None',
          includeTags: 'None',
          name: 'A Webhook',
          type: 'email',
        },
        {
          enabled: 'true',
          excludeTags: 'None',
          includeTags: 'None',
          name: 'A Webhook',
          type: 'email',
        },
      ]);
    });
});
