/* eslint-disable camelcase */
import {test} from '@oclif/test';
import {expect} from 'chai';
import * as fs from 'fs-extra';

const defaultWorkflow = {
  meta: {
    project_id: 'qwerty',
    name: 'My Workflow',
    workspace: 'global',
    tags: [],
    owner: 'qwerty',
    deployments: null,
    created: '2023',
    last_update: '2023',
    description: null,
  },
  id: 'abc123',
  workflow: {
    handle_cookies: false,
    call_ids: ['1', '2', '3'],
    stop_on_failure: true,
  },
};

const workflowBackoff = {
  meta: {
    project_id: 'qwerty',
    name: 'My Workflow',
    workspace: 'global',
    tags: [
      'apimetrics:backoff:fibo',
      'apimetrics:backoff:expo',
      'apimetrics:backoff:constant',
      'apimetrics:backoff:none',
    ],
    owner: 'qwerty',
    deployments: null,
    created: '2023',
    last_update: '2023',
    description: null,
  },
  id: 'abc123',
  workflow: {
    handle_cookies: false,
    call_ids: ['1', '2', '3'],
    stop_on_failure: true,
  },
};

const emptyWorkflow = {
  meta: {
    project_id: 'qwerty',
    name: 'My Workflow',
    workspace: 'global',
    tags: [],
    owner: 'qwerty',
    deployments: null,
    created: '2023',
    last_update: '2023',
    description: null,
  },
  id: 'abc123',
  workflow: {
    handle_cookies: false,
    call_ids: [],
    stop_on_failure: true,
  },
};

describe('workflows edit', () => {
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

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'A New Name',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--name=A New Name'])
    .it('Update name');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: 'A description',
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--description=A description'])
    .it('Update description');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: true,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--handle-cookies'])
    .it('Enable handle cookies');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            owner: 'qwerty',
            deployments: null,
            created: '2023',
            last_update: '2023',
            description: null,
          },
          id: 'abc123',
          workflow: {
            handle_cookies: true,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--no-handle-cookies'])
    .it('Disable handle cookies');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: false,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--no-stop-on-failure'])
    .it('Disable stop on failure');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            owner: 'qwerty',
            deployments: null,
            created: '2023',
            last_update: '2023',
            description: null,
          },
          id: 'abc123',
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: false,
          },
        })
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--stop-on-failure'])
    .it('Enable stop on failure');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: ['apimetrics:project_action'],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--show-as-action'])
    .it('Enable show as action');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: ['apimetrics:project_action'],
            owner: 'qwerty',
            deployments: null,
            created: '2023',
            last_update: '2023',
            description: null,
          },
          id: 'abc123',
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--no-show-as-action'])
    .it('Disable show as action');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: ['apimetrics:workflow_mutex'],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--no-parallel'])
    .it('Disable parallel workflow');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: ['apimetrics:workflow_mutex'],
            owner: 'qwerty',
            deployments: null,
            created: '2023',
            last_update: '2023',
            description: null,
          },
          id: 'abc123',
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--parallel'])
    .it('Enable parallel workflow');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .get('/api/2/agents/info')
        .reply(200, {locations: {us1: 'a', eu1: 'a'}})
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: ['apimetrics:location_id:us1'],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--location=us1'])
    .it('Enable running from specific location');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: ['apimetrics:location_id:eu1'],
            owner: 'qwerty',
            deployments: null,
            created: '2023',
            last_update: '2023',
            description: null,
          },
          id: 'abc123',
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .get('/api/2/agents/info')
        .reply(200, {locations: {us1: 'a', eu1: 'a'}})
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: ['apimetrics:location_id:us1'],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--location=us1'])
    .it('Switch location to run from');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: ['apimetrics:location_id:eu1'],
            owner: 'qwerty',
            deployments: null,
            created: '2023',
            last_update: '2023',
            description: null,
          },
          id: 'abc123',
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .get('/api/2/agents/info')
        .reply(200, {locations: {us1: 'a', eu1: 'a'}})
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: ['apimetrics:location_id:eu1'],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--location=eu1'])
    .it('Switch location to run from (set same)');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .get('/api/2/agents/info')
        .reply(200, {locations: {us1: 'a', eu1: 'a'}});
    })
    .stderr()
    .command(['workflows:edit', '--workflow-id=abc123', '--location=qwerty'])
    .catch((error) => {
      expect(error.message).to.contain(
        "Invalid location qwerty. Run 'apimetrics info locations' to see valid locations."
      );
    })
    .it('Run from invalid location');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: ['apimetrics:location_id:eu1'],
            owner: 'qwerty',
            deployments: null,
            created: '2023',
            last_update: '2023',
            description: null,
          },
          id: 'abc123',
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--no-location'])
    .it('Disable running from specific location');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            owner: 'qwerty',
            deployments: null,
            created: '2023',
            last_update: '2023',
            description: null,
          },
          id: 'abc123',
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--no-location'])
    .it('Disable running from specific location (already not running from location)');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, workflowBackoff)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: ['apimetrics:backoff:fibo'],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--retry-method=fibonacci'])
    .it('Fibonacci retry');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, workflowBackoff)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: ['apimetrics:backoff:expo'],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--retry-method=exponential'])
    .it('Exponential retry');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, workflowBackoff)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: ['apimetrics:backoff:constant'],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--retry-method=constant'])
    .it('Constant retry');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, workflowBackoff)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: ['apimetrics:backoff:none'],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--retry-method=never'])
    .it('Never retry');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, workflowBackoff)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--no-retry'])
    .it('Disable retry');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [
              'apimetrics:backoff_base:10',
              'apimetrics:backoff_factor:10',
              'apimetrics:backoff_interval:10',
            ],
            owner: 'qwerty',
            deployments: null,
            created: '2023',
            last_update: '2023',
            description: null,
          },
          id: 'abc123',
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [
              'apimetrics:backoff_base:20',
              'apimetrics:backoff_factor:20',
              'apimetrics:backoff_interval:20',
            ],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command([
      'workflows:edit',
      '--workflow-id=abc123',
      '--retry-base=20',
      '--retry-factor=20',
      '--retry-interval=20',
    ])
    .it('Update exponential and constant retry options');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [
              'apimetrics:backoff_base:10',
              'apimetrics:backoff_factor:10',
              'apimetrics:backoff_interval:10',
            ],
            owner: 'qwerty',
            deployments: null,
            created: '2023',
            last_update: '2023',
            description: null,
          },
          id: 'abc123',
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [
              'apimetrics:backoff_base:10',
              'apimetrics:backoff_factor:10',
              'apimetrics:backoff_interval:10',
            ],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command([
      'workflows:edit',
      '--workflow-id=abc123',
      '--retry-base=10',
      '--retry-factor=10',
      '--retry-interval=10',
    ])
    .it('Update exponential and constant retry options (set same)');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [
              'apimetrics:backoff_base:20',
              'apimetrics:backoff_factor:20',
              'apimetrics:backoff_interval:20',
            ],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command([
      'workflows:edit',
      '--workflow-id=abc123',
      '--retry-base=20',
      '--retry-factor=20',
      '--retry-interval=20',
    ])
    .it('Set exponential and constant retry options');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [
              'apimetrics:backoff_max_retries:10',
              'apimetrics:backoff_skip_save:10',
              'apimetrics:backoff_skip_notifs:10',
            ],
            owner: 'qwerty',
            deployments: null,
            created: '2023',
            last_update: '2023',
            description: null,
          },
          id: 'abc123',
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [
              'apimetrics:backoff_max_retries:20',
              'apimetrics:backoff_skip_save:20',
              'apimetrics:backoff_skip_notifs:20',
            ],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command([
      'workflows:edit',
      '--workflow-id=abc123',
      '--max-retries=20',
      '--ignore-in-stats=20',
      '--skip-notifications=20',
    ])
    .it('Update general retry options');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [
              'apimetrics:backoff_max_retries:10',
              'apimetrics:backoff_skip_save:10',
              'apimetrics:backoff_skip_notifs:10',
            ],
            owner: 'qwerty',
            deployments: null,
            created: '2023',
            last_update: '2023',
            description: null,
          },
          id: 'abc123',
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [
              'apimetrics:backoff_max_retries:10',
              'apimetrics:backoff_skip_save:10',
              'apimetrics:backoff_skip_notifs:10',
            ],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command([
      'workflows:edit',
      '--workflow-id=abc123',
      '--max-retries=10',
      '--ignore-in-stats=10',
      '--skip-notifications=10',
    ])
    .it('Update general retry options (set same)');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [
              'apimetrics:backoff_max_retries:20',
              'apimetrics:backoff_skip_save:20',
              'apimetrics:backoff_skip_notifs:20',
            ],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command([
      'workflows:edit',
      '--workflow-id=abc123',
      '--max-retries=20',
      '--ignore-in-stats=20',
      '--skip-notifications=20',
    ])
    .it('Set general retry options');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--remove-call=1'])
    .it('Remove middle call');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--remove-call=0'])
    .it('Remove first call');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['2'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--remove-call=0', '--remove-call=2'])
    .it('Remove multiple calls');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/workflows/abc123/').reply(200, emptyWorkflow);
    })
    .stderr()
    .command(['workflows:edit', '--workflow-id=abc123', '--remove-call=0'])
    .catch((error) => {
      expect(error.message).to.contain('There are no calls to remove.');
    })
    .it('Remove call from empty workflow');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/workflows/abc123/').reply(200, defaultWorkflow);
    })
    .stderr()
    .command(['workflows:edit', '--workflow-id=abc123', '--remove-call=10'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Call index 10 is out of range. Index must be between 0 and 2.'
      );
    })
    .it('Remove call index out of range');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '3', '4'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--add-call=4,-1'])
    .it('Add call to end');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['4', '1', '2', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--add-call=4,0'])
    .it('Add call to start');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '2', '4', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--add-call=4,2'])
    .it('Add call to middle');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['5', '1', '6', '2', '3', '4'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command([
      'workflows:edit',
      '--workflow-id=abc123',
      '--add-call=4,-1',
      '--add-call=5,0',
      '--add-call=6,1',
    ])
    .it('Add multiple calls');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/workflows/abc123/').reply(200, defaultWorkflow);
    })
    .stderr()
    .command(['workflows:edit', '--workflow-id=abc123', '--add-call=4,qwerty'])
    .catch((error) => {
      expect(error.message).to.contain('Index qwerty is not an integer.');
    })
    .it('Add call with string index');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/workflows/abc123/').reply(200, defaultWorkflow);
    })
    .stderr()
    .command(['workflows:edit', '--workflow-id=abc123', '--add-call=4,1.5'])
    .catch((error) => {
      expect(error.message).to.contain('Index 1.5 is not an integer.');
    })
    .it('Add call with float index');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/workflows/abc123/').reply(200, defaultWorkflow);
    })
    .stderr()
    .command(['workflows:edit', '--workflow-id=abc123', '--add-call=4,10'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Call index 10 is out of range. Index must be between -1 and 2.'
      );
    })
    .it('Add with index out of range');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, emptyWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['4'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--add-call=4,0'])
    .it('Add call to empty workflow');

  auth
    .nock('https://client.apimetrics.io', (api) => {
      api
        .get('/api/2/workflows/abc123/')
        .reply(200, defaultWorkflow)
        .post('/api/2/workflows/abc123/', {
          meta: {
            project_id: 'qwerty',
            name: 'My Workflow',
            workspace: 'global',
            tags: [],
            description: null,
          },
          workflow: {
            handle_cookies: false,
            call_ids: ['1', '4', '3'],
            stop_on_failure: true,
          },
        })
        .reply(200, {});
    })
    .stdout()
    .command(['workflows:edit', '--workflow-id=abc123', '--add-call=4,1', '--remove-call=1'])
    .it('Replace call');
});
