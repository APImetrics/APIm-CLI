/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const webhook = {
  id: 'abc123',
};

const meta = {
  name: 'A Webhook',
  include_tags: [],
  exclude_tags: [],
};

describe('webhooks edit', () => {
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

  noProject
    .nock(
      'https://client.apimetrics.io',
      {reqheaders: {'Apimetrics-Project-Id': (val) => val === '123'}},
      (api) => {
        api
          .get('/api/2/webhooks/abc123')
          .reply(200, {
            meta: meta,
            webhook: {
              enabled: true,
              alerts: ['SLOW'],
              type: 'email',
              parameters: {
                email_address: 'alice@example.com',
                fails_in_a_row: '0',
              },
            },
          })
          .post('/api/2/webhooks/abc123', {
            meta: meta,
            webhook: {
              enabled: true,
              alerts: ['FAIL'],
              type: 'email',
              parameters: {
                email_address: 'alice@example.com',
                fails_in_a_row: '0',
              },
            },
          })
          .reply(200, webhook);
      }
    )
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--email-address=alice@example.com',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '-p=123',
      '--json',
    ])
    .it('Passing project ID', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'email',
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'email',
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--email-address=alice@example.com',
      '--add-alert=SLOW',
      '--json',
    ])
    .it('Add already existing alert', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'email',
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'email',
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--email-address=alice@example.com',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('email', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/webhooks/abc123').reply(200, {
        meta: meta,
        webhook: {
          enabled: true,
          alerts: ['SLOW'],
          type: 'email',
          parameters: {
            email_address: 'alice@example.com',
            fails_in_a_row: '0',
          },
        },
      });
    })
    .stderr()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--email-address=qwerty',
      '--name=A Webhook',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
    ])
    .catch((error) => {
      expect(error.message).to.contain('qwerty is not a valid email.');
    })
    .it('email invalid email address');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'email_text',
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'email_text',
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--email-address=alice@example.com',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('email_text', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/webhooks/abc123').reply(200, {
        meta: meta,
        webhook: {
          enabled: true,
          alerts: ['SLOW'],
          type: 'email_text',
          parameters: {
            email_address: 'alice@example.com',
            fails_in_a_row: '0',
          },
        },
      });
    })
    .stderr()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--email-address=qwerty',
      '--name=A Webhook',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
    ])
    .catch((error) => {
      expect(error.message).to.contain('qwerty is not a valid email.');
    })
    .it('email_text invalid email address');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'email_template',
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
              subject_template: 'abc',
              text_template: 'abc',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'email_template',
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
              subject_template: 'abc',
              text_template: 'abc',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--email-address=alice@example.com',
      '--subject-template=abc',
      '--text-template=abc',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('email_template', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/webhooks/abc123').reply(200, {
        meta: meta,
        webhook: {
          enabled: true,
          alerts: ['SLOW'],
          type: 'email_template',
          parameters: {
            email_address: 'alice@example.com',
            fails_in_a_row: '0',
            subject_template: 'abc',
            text_template: 'abc',
          },
        },
      });
    })
    .stderr()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--email-address=qwerty',
      '--name=A Webhook',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
    ])
    .catch((error) => {
      expect(error.message).to.contain('qwerty is not a valid email.');
    })
    .it('email_template invalid email address');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'generic',
            parameters: {
              url: 'https://example.com/',
              username: 'bob',
              password: 'passw0rd',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'generic',
            parameters: {
              url: 'https://example.com/',
              username: 'bob',
              password: 'passw0rd',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--url=https://example.com/',
      '--username=bob',
      '--password=passw0rd',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('generic', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'generic',
            parameters: {
              url: 'https://example.com/',
              username: 'bob',
              password: 'passw0rd',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'generic',
            parameters: {
              url: 'https://example.com/',
              username: 'bob',
              password: 'passw0rd',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--url=https://example.com/',
      '--username=bob',
      '--password=passw0rd',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('generic', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'apimetrics_api',
            parameters: {
              call_id: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'apimetrics_api',
            parameters: {
              call_id: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--call-id=abc123',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('apimetrics_api', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'apimetrics_workflow',
            parameters: {
              workflow_id: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'apimetrics_workflow',
            parameters: {
              workflow_id: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--workflow-id=abc123',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('apimetrics_workflow', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'apimetrics_token',
            parameters: {
              token_id: 'abc123',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'apimetrics_token',
            parameters: {
              token_id: 'abc123',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--token-id=abc123',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('apimetrics_token', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'slack',
            parameters: {
              url: 'https://hooks.slack.com/services/abc123',
              channel: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'slack',
            parameters: {
              url: 'https://hooks.slack.com/services/abc123',
              channel: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--url=https://hooks.slack.com/services/abc123',
      '--channel=abc123',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('slack', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'pager_duty',
            parameters: {
              integration_key: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'pager_duty',
            parameters: {
              integration_key: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--integration-key=abc123',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('pager_duty', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'pager_duty_v2',
            parameters: {
              integration_key: 'abc123',
              severity: 'critical',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'pager_duty_v2',
            parameters: {
              integration_key: 'abc123',
              severity: 'critical',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--integration-key=abc123',
      '--severity=critical',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('pager_duty_v2', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'big_panda',
            parameters: {
              user_key: 'abc123',
              app_key: 'def456',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'big_panda',
            parameters: {
              user_key: 'abc123',
              app_key: 'def456',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--user-key=abc123',
      '--app-key=def456',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('big_panda', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'victorops',
            parameters: {
              api_key: 'abc123',
              routing_key: 'def456',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'victorops',
            parameters: {
              api_key: 'abc123',
              routing_key: 'def456',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--api-key=abc123',
      '--routing-key=def456',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('victorops', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'hipchat',
            parameters: {
              url: 'https://example.hipchat.com/v2/room/123/notification?auth_token=456',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'hipchat',
            parameters: {
              url: 'https://example.hipchat.com/v2/room/123/notification?auth_token=456',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--url=https://example.hipchat.com/v2/room/123/notification?auth_token=456',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('hipchat', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'msteams',
            parameters: {
              url: 'https://example.com/',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'msteams',
            parameters: {
              url: 'https://example.com/',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--url=https://example.com/',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('msteams', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'newrelic',
            parameters: {
              app_key: 'abc123',
              api_key: 'def456',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'newrelic',
            parameters: {
              app_key: 'abc123',
              api_key: 'def456',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--app-key=abc123',
      '--api-key=def456',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('newrelic', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'darkspark',
            parameters: {},
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'darkspark',
            parameters: {},
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('darkspark', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'datadog',
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'datadog',
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--api-key=abc123',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('datadog', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'datadogevent',
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'datadogevent',
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--api-key=abc123',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('datadogevent', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'statuspage',
            parameters: {
              page_id: 'abc123',
              api_key: 'def456',
              component_id: 'ghi789',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'statuspage',
            parameters: {
              page_id: 'abc123',
              api_key: 'def456',
              component_id: 'ghi789',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--page-id=abc123',
      '--api-key=def456',
      '--component-id=ghi789',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('statuspage', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'flowdock',
            parameters: {
              flow_token: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'flowdock',
            parameters: {
              flow_token: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--flow-token=abc123',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('flowdock', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'opsgenie',
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'opsgenie',
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--api-key=abc123',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('opsgenie', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/webhooks/abc123')
        .reply(200, {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['SLOW'],
            type: 'opsgenieeu',
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta: meta,
          webhook: {
            enabled: true,
            alerts: ['FAIL'],
            type: 'opsgenieeu',
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:edit',
      '--webhook-id=abc123',
      '--name=A Webhook',
      '--api-key=abc123',
      '--add-alert=FAIL',
      '--remove-alert=SLOW',
      '--json',
    ])
    .it('opsgenieeu', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        webhook: {
          id: 'abc123',
        },
      });
    });
});
