/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const scheduleResponse = {
  meta: {
    name: 'schedule',
    created: '2023-05-17T00:48:56.286524Z',
    tags: [],
    last_update: '2023-06-07T23:16:10.378774Z',
    owner: 'abc123',
    project_id: 'abc123',
  },
  id: 'abc123',
  schedule: {
    regions: ['all'],
    frequency: 300,
    locations: [],
    target_ids: [],
    backoff_method: null,
  },
};

const scheduleResponseBackoff = {
  meta: {
    name: 'schedule',
    created: '2023-05-17T00:48:56.286524Z',
    tags: ['apimetrics:backoff:fibo', 'apimetrics:backoff:expo', 'apimetrics:backoff:constant'],
    last_update: '2023-06-07T23:16:10.378774Z',
    owner: 'abc123',
    project_id: 'abc123',
  },
  id: 'abc123',
  schedule: {
    regions: ['all'],
    frequency: 300,
    locations: [],
    target_ids: [],
    backoff_method: null,
  },
};

const info = {
  regions: [
    {id: 'sft', name: 'IBM Cloud', locations: ['public_qcazureasiase', 'public_qcawsuswest']},
    {id: 'eu', name: 'Europe', locations: ['public_qcazureasiase', 'public_qcawsuswest']},
    {id: 'azr', name: 'Microsoft Azure', locations: ['public_qcazureasiase', 'public_qcawsuswest']},
    {id: 'na', name: 'North America', locations: ['public_qcazureasiase', 'public_qcawsuswest']},
    {id: 'oc', name: 'Oceania', locations: ['public_qcazureasiase']},
    {id: 'sa', name: 'South America', locations: ['public_qcazureasiase', 'public_qcawsuswest']},
    {id: 'aws', name: 'Amazon AWS', locations: ['public_qcazureasiase', 'public_qcawsuswest']},
    {
      id: 'all',
      name: 'Worldwide',
      locations: ['public_qcazureasiase', 'public_qcawsuswest', 'public_qcgoogleuscentral'],
    },
    {id: 'af', name: 'Africa', locations: ['public_azuresouthafricanorth']},
    {id: 'ap', name: 'Asia-Pacfic', locations: ['public_qcazureasiase', 'public_qcawsuswest']},
    {id: 'goo', name: 'Google Cloud', locations: ['public_qcazureasiase', 'public_qcawsuswest']},
    {id: 'ww', name: null, locations: ['public_qcazureasiase', 'public_qcawsuswest']},
  ],
  locations: {
    '': 'QC Default - QC AWS US West (Oregon)',
    public_qcazureasiase:
      'Azure QC Singapore With a Really Really Really Really Really Really Really Really Really Really Long Name [Singapore, Asia]',
    public_qcawsuswest: 'AWS QC Oregon [United States, North America]',
    public_qcgoogleuscentral: 'Google QC US Central [United States, North America]',
    qcmetrics_demoagent: 'Demo Agent [United States, North America]',
  },
  postman_locations: ['public_qcawsuswest', 'public_qcgoogleuscentral', 'public_qcazureasiase'],
};

describe('schedules edit', () => {
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
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, scheduleResponse)
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: [],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 60,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command(['schedules:edit', '--schedule-id=abc123', '--interval=1m'])
    .it('Edit interval (m)');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, scheduleResponse)
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: [],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 86_400,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command(['schedules:edit', '--schedule-id=abc123', '--interval=24h'])
    .it('Edit interval (h)');

  noProject
    .nock(
      'https://client.apimetrics.io',
      {reqheaders: {'Apimetrics-Project-Id': (val) => val === 'abc123'}},
      (api) =>
        api
          .get('/api/2/schedules/abc123/')
          .reply(200, scheduleResponse)
          .post('/api/2/schedules/abc123/', {
            meta: {
              name: 'schedule',
              tags: [],
              project_id: 'abc123',
            },
            schedule: {
              regions: ['all'],
              frequency: 60,
              locations: [],
              target_ids: [],
              backoff_method: null,
            },
          })
          .reply(200, {})
    )
    .stdout()
    .command(['schedules:edit', '--schedule-id=abc123', '--interval=1m', '-p=abc123'])
    .it('Pass project ID');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, scheduleResponse)
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'abc',
            tags: [],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command(['schedules:edit', '--schedule-id=abc123', '--name=abc'])
    .it('Edit name');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, scheduleResponse)
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: ['apimetrics:postman'],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command(['schedules:edit', '--schedule-id=abc123', '--postman'])
    .it('Enable postman');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, {
          meta: {
            name: 'schedule',
            tags: ['apimetrics:postman'],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: [],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command(['schedules:edit', '--schedule-id=abc123', '--no-postman'])
    .it('Disable postman');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, scheduleResponseBackoff)
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: ['apimetrics:backoff:fibo'],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command(['schedules:edit', '--schedule-id=abc123', '--retry-method=fibonacci'])
    .it('Fibonacci retry');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, scheduleResponseBackoff)
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: ['apimetrics:backoff:expo'],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command(['schedules:edit', '--schedule-id=abc123', '--retry-method=exponential'])
    .it('Exponential retry');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, scheduleResponseBackoff)
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: ['apimetrics:backoff:constant'],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command(['schedules:edit', '--schedule-id=abc123', '--retry-method=constant'])
    .it('Constant retry');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, scheduleResponseBackoff)
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: [],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command(['schedules:edit', '--schedule-id=abc123', '--no-retry'])
    .it('Disable retry');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, {
          meta: {
            name: 'schedule',
            created: '2023-05-17T00:48:56.286524Z',
            tags: [
              'apimetrics:backoff_base:10',
              'apimetrics:backoff_factor:10',
              'apimetrics:backoff_interval:10',
            ],
            last_update: '2023-06-07T23:16:10.378774Z',
            owner: 'abc123',
            project_id: 'abc123',
          },
          id: 'abc123',
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: [
              'apimetrics:backoff_base:20',
              'apimetrics:backoff_factor:20',
              'apimetrics:backoff_interval:20',
            ],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command([
      'schedules:edit',
      '--schedule-id=abc123',
      '--retry-base=20',
      '--retry-factor=20',
      '--retry-interval=20',
    ])
    .it('Update exponential and constant retry options');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, {
          meta: {
            name: 'schedule',
            created: '2023-05-17T00:48:56.286524Z',
            tags: [
              'apimetrics:backoff_base:10',
              'apimetrics:backoff_factor:10',
              'apimetrics:backoff_interval:10',
            ],
            last_update: '2023-06-07T23:16:10.378774Z',
            owner: 'abc123',
            project_id: 'abc123',
          },
          id: 'abc123',
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: [
              'apimetrics:backoff_base:10',
              'apimetrics:backoff_factor:10',
              'apimetrics:backoff_interval:10',
            ],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command([
      'schedules:edit',
      '--schedule-id=abc123',
      '--retry-base=10',
      '--retry-factor=10',
      '--retry-interval=10',
    ])
    .it('Update exponential and constant retry options (set same)');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, {
          meta: {
            name: 'schedule',
            created: '2023-05-17T00:48:56.286524Z',
            tags: [],
            last_update: '2023-06-07T23:16:10.378774Z',
            owner: 'abc123',
            project_id: 'abc123',
          },
          id: 'abc123',
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: [
              'apimetrics:backoff_base:20',
              'apimetrics:backoff_factor:20',
              'apimetrics:backoff_interval:20',
            ],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command([
      'schedules:edit',
      '--schedule-id=abc123',
      '--retry-base=20',
      '--retry-factor=20',
      '--retry-interval=20',
    ])
    .it('Set exponential and constant retry options');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, {
          meta: {
            name: 'schedule',
            created: '2023-05-17T00:48:56.286524Z',
            tags: [
              'apimetrics:backoff_max_retries:10',
              'apimetrics:backoff_skip_save:10',
              'apimetrics:backoff_skip_notifs:10',
            ],
            last_update: '2023-06-07T23:16:10.378774Z',
            owner: 'abc123',
            project_id: 'abc123',
          },
          id: 'abc123',
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: [
              'apimetrics:backoff_max_retries:20',
              'apimetrics:backoff_skip_save:20',
              'apimetrics:backoff_skip_notifs:20',
            ],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command([
      'schedules:edit',
      '--schedule-id=abc123',
      '--max-retries=20',
      '--ignore-in-stats=20',
      '--skip-notifications=20',
    ])
    .it('Update general retry options');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, {
          meta: {
            name: 'schedule',
            created: '2023-05-17T00:48:56.286524Z',
            tags: [
              'apimetrics:backoff_max_retries:10',
              'apimetrics:backoff_skip_save:10',
              'apimetrics:backoff_skip_notifs:10',
            ],
            last_update: '2023-06-07T23:16:10.378774Z',
            owner: 'abc123',
            project_id: 'abc123',
          },
          id: 'abc123',
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: [
              'apimetrics:backoff_max_retries:10',
              'apimetrics:backoff_skip_save:10',
              'apimetrics:backoff_skip_notifs:10',
            ],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command([
      'schedules:edit',
      '--schedule-id=abc123',
      '--max-retries=10',
      '--ignore-in-stats=10',
      '--skip-notifications=10',
    ])
    .it('Update general retry options (set same)');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, {
          meta: {
            name: 'schedule',
            created: '2023-05-17T00:48:56.286524Z',
            tags: [],
            last_update: '2023-06-07T23:16:10.378774Z',
            owner: 'abc123',
            project_id: 'abc123',
          },
          id: 'abc123',
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: [
              'apimetrics:backoff_max_retries:20',
              'apimetrics:backoff_skip_save:20',
              'apimetrics:backoff_skip_notifs:20',
            ],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all'],
            frequency: 300,
            locations: [],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command([
      'schedules:edit',
      '--schedule-id=abc123',
      '--max-retries=20',
      '--ignore-in-stats=20',
      '--skip-notifications=20',
    ])
    .it('Set general retry options');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, scheduleResponse)
        .get('/api/2/agents/info')
        .reply(200, info)
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: [],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['all', 'eu'],
            frequency: 300,
            locations: ['public_qcazureasiase'],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command([
      'schedules:edit',
      '--schedule-id=abc123',
      '--add-location=public_qcazureasiase',
      '--add-region=eu',
    ])
    .it('Add locations and regions');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, {
          meta: {
            name: 'schedule',
            created: '2023-05-17T00:48:56.286524Z',
            tags: [],
            last_update: '2023-06-07T23:16:10.378774Z',
            owner: 'abc123',
            project_id: 'abc123',
          },
          id: 'abc123',
          schedule: {
            regions: ['eu', 'us'],
            frequency: 300,
            locations: ['public_qcazureasiase', 'public_qcawsuswest'],
            target_ids: [],
            backoff_method: null,
          },
        })
        .get('/api/2/agents/info')
        .reply(200, info)
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            tags: [],
            project_id: 'abc123',
          },
          schedule: {
            regions: ['us'],
            frequency: 300,
            locations: ['public_qcawsuswest'],
            target_ids: [],
            backoff_method: null,
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command([
      'schedules:edit',
      '--schedule-id=abc123',
      '--remove-location=public_qcazureasiase',
      '--remove-region=eu',
    ])
    .it('Remove locations and regions');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, scheduleResponse)
        .get('/api/2/agents/info')
        .reply(200, info)
    )
    .stderr()
    .command(['schedules:edit', '--schedule-id=abc123', '--add-location=abc123'])
    .catch((error) => {
      expect(error.message).to.contain(
        "Invalid location abc123. Run 'apimetrics info locations' to see valid locations."
      );
    })
    .it('Invalid location');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, scheduleResponse)
        .get('/api/2/agents/info')
        .reply(200, info)
    )
    .stderr()
    .command(['schedules:edit', '--schedule-id=abc123', '--add-region=abc123'])
    .catch((error) => {
      expect(error.message).to.contain(
        "Invalid region abc123. Run 'apimetrics info regions' to see valid region IDs."
      );
    })
    .it('Invalid region');

  auth
    .stderr()
    .command(['schedules:edit'])
    .catch((error) => {
      expect(error.message).to.contain('Missing required flag schedule-id');
    })
    .it('Missing required flags');
});
