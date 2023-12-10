/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const webhook = {
  id: 'abc123',
};

const meta = {
  exclude_tags: [],
  include_tags: [],
  name: 'A Webhook',
};

describe('webhooks edit', () => {
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

  noProject
    .nock(
      'https://client.apimetrics.io',
      {reqheaders: {'Apimetrics-Project-Id': (val) => val === '123'}},
      (api) => {
        api
          .get('/api/2/webhooks/abc123')
          .reply(200, {
            meta,
            webhook: {
              alerts: ['SLOW'],
              enabled: true,
              parameters: {
                email_address: 'alice@example.com',
                fails_in_a_row: '0',
              },
              type: 'email',
            },
          })
          .post('/api/2/webhooks/abc123', {
            meta,
            webhook: {
              alerts: ['FAIL'],
              enabled: true,
              parameters: {
                email_address: 'alice@example.com',
                fails_in_a_row: '0',
              },
              type: 'email',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
            },
            type: 'email',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
            },
            type: 'email',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
            },
            type: 'email',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
            },
            type: 'email',
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
        meta,
        webhook: {
          alerts: ['SLOW'],
          enabled: true,
          parameters: {
            email_address: 'alice@example.com',
            fails_in_a_row: '0',
          },
          type: 'email',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
            },
            type: 'email_text',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
            },
            type: 'email_text',
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
        meta,
        webhook: {
          alerts: ['SLOW'],
          enabled: true,
          parameters: {
            email_address: 'alice@example.com',
            fails_in_a_row: '0',
          },
          type: 'email_text',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
              subject_template: 'abc',
              text_template: 'abc',
            },
            type: 'email_template',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              email_address: 'alice@example.com',
              fails_in_a_row: '0',
              subject_template: 'abc',
              text_template: 'abc',
            },
            type: 'email_template',
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
        meta,
        webhook: {
          alerts: ['SLOW'],
          enabled: true,
          parameters: {
            email_address: 'alice@example.com',
            fails_in_a_row: '0',
            subject_template: 'abc',
            text_template: 'abc',
          },
          type: 'email_template',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              password: 'passw0rd',
              url: 'https://example.com/',
              username: 'bob',
            },
            type: 'generic',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              password: 'passw0rd',
              url: 'https://example.com/',
              username: 'bob',
            },
            type: 'generic',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              password: 'passw0rd',
              url: 'https://example.com/',
              username: 'bob',
            },
            type: 'generic',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              password: 'passw0rd',
              url: 'https://example.com/',
              username: 'bob',
            },
            type: 'generic',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              call_id: 'abc123',
              fails_in_a_row: '0',
            },
            type: 'apimetrics_api',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              call_id: 'abc123',
              fails_in_a_row: '0',
            },
            type: 'apimetrics_api',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              workflow_id: 'abc123',
            },
            type: 'apimetrics_workflow',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              workflow_id: 'abc123',
            },
            type: 'apimetrics_workflow',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              token_id: 'abc123',
            },
            type: 'apimetrics_token',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              token_id: 'abc123',
            },
            type: 'apimetrics_token',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              channel: 'abc123',
              fails_in_a_row: '0',
              url: 'https://hooks.slack.com/services/abc123',
            },
            type: 'slack',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              channel: 'abc123',
              fails_in_a_row: '0',
              url: 'https://hooks.slack.com/services/abc123',
            },
            type: 'slack',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              integration_key: 'abc123',
            },
            type: 'pager_duty',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              integration_key: 'abc123',
            },
            type: 'pager_duty',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              integration_key: 'abc123',
              severity: 'critical',
            },
            type: 'pager_duty_v2',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              integration_key: 'abc123',
              severity: 'critical',
            },
            type: 'pager_duty_v2',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              app_key: 'def456',
              fails_in_a_row: '0',
              user_key: 'abc123',
            },
            type: 'big_panda',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              app_key: 'def456',
              fails_in_a_row: '0',
              user_key: 'abc123',
            },
            type: 'big_panda',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
              routing_key: 'def456',
            },
            type: 'victorops',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
              routing_key: 'def456',
            },
            type: 'victorops',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              url: 'https://example.hipchat.com/v2/room/123/notification?auth_token=456',
            },
            type: 'hipchat',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              url: 'https://example.hipchat.com/v2/room/123/notification?auth_token=456',
            },
            type: 'hipchat',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              url: 'https://example.com/',
            },
            type: 'msteams',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              url: 'https://example.com/',
            },
            type: 'msteams',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              api_key: 'def456',
              app_key: 'abc123',
              fails_in_a_row: '0',
            },
            type: 'newrelic',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              api_key: 'def456',
              app_key: 'abc123',
              fails_in_a_row: '0',
            },
            type: 'newrelic',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {},
            type: 'darkspark',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {},
            type: 'darkspark',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
            type: 'datadog',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
            type: 'datadog',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
            type: 'datadogevent',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
            type: 'datadogevent',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              api_key: 'def456',
              component_id: 'ghi789',
              fails_in_a_row: '0',
              page_id: 'abc123',
            },
            type: 'statuspage',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              api_key: 'def456',
              component_id: 'ghi789',
              fails_in_a_row: '0',
              page_id: 'abc123',
            },
            type: 'statuspage',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              flow_token: 'abc123',
            },
            type: 'flowdock',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              fails_in_a_row: '0',
              flow_token: 'abc123',
            },
            type: 'flowdock',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
            type: 'opsgenie',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
            type: 'opsgenie',
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
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
            type: 'opsgenieeu',
          },
        })
        .post('/api/2/webhooks/abc123', {
          meta,
          webhook: {
            alerts: ['FAIL'],
            enabled: true,
            parameters: {
              api_key: 'abc123',
              fails_in_a_row: '0',
            },
            type: 'opsgenieeu',
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
