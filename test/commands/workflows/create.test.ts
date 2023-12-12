/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

describe('workflows create', () => {
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
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/workflows/', {
          meta: {name: 'A Workflow', tags: []},
          workflow: {handle_cookies: false, stop_on_failure: true},
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['workflows:create', '--name=A Workflow'])
    .it('Create a minimal workflow', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  noProject
    .nock(
      'https://client.apimetrics.io',
      {reqheaders: {'Apimetrics-Project-Id': (val) => val === 'abc123'}},
      (api) =>
        api
          .post('/api/2/workflows/', {
            meta: {name: 'A Workflow', tags: []},
            workflow: {handle_cookies: false, stop_on_failure: true},
          })
          .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['workflows:create', '--name=A Workflow', '-p=abc123'])
    .it('Create a minimal workflow passing project ID', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/workflows/', {
          meta: {name: 'A Workflow', tags: []},
          workflow: {
            call_ids: ['abc123', 'def456', 'ghi789'],
            handle_cookies: false,
            stop_on_failure: true,
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command([
      'workflows:create',
      '--name=A Workflow',
      '--call=abc123',
      '--call=def456',
      '--call=ghi789',
    ])
    .it('Specify calls to add', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/workflows/', {
          meta: {name: 'A Workflow', tags: ['apimetrics:project_action']},
          workflow: {
            handle_cookies: false,
            stop_on_failure: true,
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['workflows:create', '--name=A Workflow', '--show-as-action'])
    .it('Show as action', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/workflows/', {
          meta: {name: 'A Workflow', tags: ['apimetrics:workflow_mutex']},
          workflow: {
            handle_cookies: false,
            stop_on_failure: true,
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['workflows:create', '--name=A Workflow', '--no-parallel'])
    .it('Disable parallel running', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/agents/info')
        .reply(200, {locations: {eu1: 'a', us1: 'a'}})
        .post('/api/2/workflows/', {
          meta: {name: 'A Workflow', tags: ['apimetrics:location_id:us1']},
          workflow: {
            handle_cookies: false,
            stop_on_failure: true,
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['workflows:create', '--name=A Workflow', '--location=us1'])
    .it('Run from location', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/agents/info').reply(200, {locations: {eu1: 'a', us1: 'a'}})
    )
    .stdout()
    .command(['workflows:create', '--name=A Workflow', '--location=qwerty'])
    .catch((error) => {
      expect(error.message).to.contain(
        "Invalid location qwerty. Run 'apimetrics info locations' to see valid locations."
      );
    })
    .it('Run from invalid location');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/workflows/', {
          meta: {name: 'A Workflow', tags: ['apimetrics:backoff_max_retries:10']},
          workflow: {
            handle_cookies: false,
            stop_on_failure: true,
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['workflows:create', '--name=A Workflow', '--max-retries=10'])
    .it('Set max retries', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/workflows/', {
          meta: {name: 'A Workflow', tags: ['apimetrics:backoff_skip_save:10']},
          workflow: {
            handle_cookies: false,
            stop_on_failure: true,
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['workflows:create', '--name=A Workflow', '--ignore-in-stats=10'])
    .it('Set ignore in stats', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/workflows/', {
          meta: {name: 'A Workflow', tags: ['apimetrics:backoff_skip_notifs:10']},
          workflow: {
            handle_cookies: false,
            stop_on_failure: true,
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['workflows:create', '--name=A Workflow', '--skip-notifications=10'])
    .it('Set skip notifications', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/workflows/', {
          meta: {name: 'A Workflow', tags: ['apimetrics:backoff:fibo']},
          workflow: {
            handle_cookies: false,
            stop_on_failure: true,
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['workflows:create', '--name=A Workflow', '--retry-method=fibonacci'])
    .it('Fibonacci retry', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/workflows/', {
          meta: {name: 'A Workflow', tags: ['apimetrics:backoff:expo']},
          workflow: {
            handle_cookies: false,
            stop_on_failure: true,
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['workflows:create', '--name=A Workflow', '--retry-method=exponential'])
    .it('Exponential retry minimal', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/workflows/', {
          meta: {
            name: 'A Workflow',
            tags: [
              'apimetrics:backoff:expo',
              'apimetrics:backoff_base:10',
              'apimetrics:backoff_factor:10',
            ],
          },
          workflow: {
            handle_cookies: false,
            stop_on_failure: true,
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command([
      'workflows:create',
      '--name=A Workflow',
      '--retry-method=exponential',
      '--retry-base=10',
      '--retry-factor=10',
    ])
    .it('Exponential retry full', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/workflows/', {
          meta: {
            name: 'A Workflow',
            tags: ['apimetrics:backoff:constant'],
          },
          workflow: {
            handle_cookies: false,
            stop_on_failure: true,
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['workflows:create', '--name=A Workflow', '--retry-method=constant'])
    .it('Constant retry minimal', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/workflows/', {
          meta: {
            name: 'A Workflow',
            tags: ['apimetrics:backoff:constant', 'apimetrics:backoff_interval:10'],
          },
          workflow: {
            handle_cookies: false,
            stop_on_failure: true,
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command([
      'workflows:create',
      '--name=A Workflow',
      '--retry-method=constant',
      '--retry-interval=10',
    ])
    .it('Constant retry full', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/workflows/', {
          meta: {
            name: 'A Workflow',
            tags: ['apimetrics:backoff:none'],
          },
          workflow: {
            handle_cookies: false,
            stop_on_failure: true,
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['workflows:create', '--name=A Workflow', '--retry-method=never'])
    .it('Never retry', (ctx) => {
      expect(ctx.stdout).to.contain('abc123');
    });
});
