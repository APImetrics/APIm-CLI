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

describe('webhooks create', () => {
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
          .put('/api/2/webhooks/', {
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
      }
    )
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=email',
      '--email-address=alice@example.com',
      '--alert=SLOW',
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
        .put('/api/2/webhooks/', {
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
      'webhooks:create',
      '--name=A Webhook',
      '--type=email',
      '--email-address=alice@example.com',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=email'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --email-address')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('email missing flags');

  bearerAuth
    .stderr()
    .command([
      'webhooks:create',
      '--type=email',
      '--email-address=qwerty',
      '--name=A Webhook',
      '--alert=SLOW',
    ])
    .catch((error) => {
      expect(error.message).to.contain('qwerty is not a valid email.');
    })
    .it('email invalid email address');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=email_text',
      '--email-address=alice@example.com',
      '--alert=SLOW',
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
    .stderr()
    .command([
      'webhooks:create',
      '--type=email_text',
      '--email-address=qwerty',
      '--name=A Webhook',
      '--alert=SLOW',
    ])
    .catch((error) => {
      expect(error.message).to.contain('qwerty is not a valid email.');
    })
    .it('email_text invalid email address');

  bearerAuth
    .stderr()
    .command(['webhooks:create', '--type=email_text'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --email-address')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('email_text missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=email_template',
      '--email-address=alice@example.com',
      '--subject-template=abc',
      '--text-template=abc',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=email_template'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --email-address')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('email_template missing flags');

  bearerAuth
    .stderr()
    .command([
      'webhooks:create',
      '--type=email_template',
      '--email-address=qwerty',
      '--name=A Webhook',
      '--alert=SLOW',
    ])
    .catch((error) => {
      expect(error.message).to.contain('qwerty is not a valid email.');
    })
    .it('email_template invalid email address');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=generic',
      '--url=https://example.com/',
      '--username=bob',
      '--password=passw0rd',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=generic'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --url')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('email_template missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=generic',
      '--url=https://example.com/',
      '--username=bob',
      '--password=passw0rd',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=generic'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --url')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('generic missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=apimetrics_api',
      '--call-id=abc123',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=apimetrics_api'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --call-id')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('apimetrics_api missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=apimetrics_workflow',
      '--workflow-id=abc123',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=apimetrics_workflow'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --workflow-id')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('apimetrics_workflow missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=apimetrics_token',
      '--token-id=abc123',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=apimetrics_token'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --token-id')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('apimetrics_token missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=slack',
      '--url=https://hooks.slack.com/services/abc123',
      '--channel=abc123',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=slack'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --url')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('slack missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=pager_duty',
      '--integration-key=abc123',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=pager_duty'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --integration-key')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('pager_duty missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=pager_duty_v2',
      '--integration-key=abc123',
      '--severity=critical',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=pager_duty_v2'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --integration-key')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('pager_duty_v2 missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=big_panda',
      '--user-key=abc123',
      '--app-key=def456',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=big_panda'])
    .catch((error) => {
      expect(error.message)
        .to.contain(
          'All of the following must be provided when using --type: --user-key, --app-key'
        )
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('big_panda missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=victorops',
      '--api-key=abc123',
      '--routing-key=def456',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=victorops'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --api-key')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('victorops missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=hipchat',
      '--url=https://example.hipchat.com/v2/room/123/notification?auth_token=456',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=hipchat'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --url')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('hipchat missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=msteams',
      '--url=https://example.com/',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=msteams'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --url')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('msteams missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=newrelic',
      '--app-key=abc123',
      '--api-key=def456',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=newrelic'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --app-key, --api-key')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('newrelic missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
          meta,
          webhook: {
            alerts: ['SLOW'],
            enabled: true,
            parameters: {},
            type: 'darkspark',
          },
        })
        .reply(200, webhook);
    })
    .stdout()
    .command(['webhooks:create', '--name=A Webhook', '--type=darkspark', '--alert=SLOW', '--json'])
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
    .stderr()
    .command(['webhooks:create', '--type=darkspark'])
    .catch((error) => {
      expect(error.message)
        .to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('darkspark missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=datadog',
      '--api-key=abc123',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=datadog'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --api-key')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('datadog missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=datadogevent',
      '--api-key=abc123',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=datadogevent'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --api-key')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('datadogevent missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=statuspage',
      '--page-id=abc123',
      '--api-key=def456',
      '--component-id=ghi789',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=statuspage'])
    .catch((error) => {
      expect(error.message)
        .to.contain(
          'All of the following must be provided when using --type: --api-key, --page-id, --component-id'
        )
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('statuspage missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=flowdock',
      '--flow-token=abc123',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=flowdock'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --flow-token')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('flowdock missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=opsgenie',
      '--api-key=abc123',
      '--alert=SLOW',
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
    .stderr()
    .command(['webhooks:create', '--type=opsgenie'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --api-key')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('opsgenie missing flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .put('/api/2/webhooks/', {
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
        .reply(200, webhook);
    })
    .stdout()
    .command([
      'webhooks:create',
      '--name=A Webhook',
      '--type=opsgenieeu',
      '--api-key=abc123',
      '--alert=SLOW',
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

  bearerAuth
    .stderr()
    .command(['webhooks:create', '--type=opsgenieeu'])
    .catch((error) => {
      expect(error.message)
        .to.contain('All of the following must be provided when using --type: --api-key')
        .and.to.contain('Missing required flag alert')
        .and.to.contain('Missing required flag name');
    })
    .it('opsgenieeu missing flags');
});
