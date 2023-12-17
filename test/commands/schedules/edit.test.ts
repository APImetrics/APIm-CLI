/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const scheduleResponse = {
  id: 'abc123',
  meta: {
    created: '2023-05-17T00:48:56.286524Z',
    last_update: '2023-06-07T23:16:10.378774Z',
    name: 'schedule',
    owner: 'abc123',
    project_id: 'abc123',
    tags: [],
  },
  schedule: {
    backoff_method: null,
    frequency: 300,
    locations: [],
    regions: ['all'],
    target_ids: [],
  },
};

const scheduleResponseBackoff = {
  id: 'abc123',
  meta: {
    created: '2023-05-17T00:48:56.286524Z',
    last_update: '2023-06-07T23:16:10.378774Z',
    name: 'schedule',
    owner: 'abc123',
    project_id: 'abc123',
    tags: ['apimetrics:backoff:fibo', 'apimetrics:backoff:expo', 'apimetrics:backoff:constant'],
  },
  schedule: {
    backoff_method: null,
    frequency: 300,
    locations: [],
    regions: ['all'],
    target_ids: [],
  },
};

const info = {
  locations: {
    '': 'QC Default - QC AWS US West (Oregon)',
    public_qcawsuswest: 'AWS QC Oregon [United States, North America]',
    public_qcazureasiase:
      'Azure QC Singapore With a Really Really Really Really Really Really Really Really Really Really Long Name [Singapore, Asia]',
    public_qcgoogleuscentral: 'Google QC US Central [United States, North America]',
    qcmetrics_demoagent: 'Demo Agent [United States, North America]',
  },
  postman_locations: ['public_qcawsuswest', 'public_qcgoogleuscentral', 'public_qcazureasiase'],
  regions: [
    {id: 'sft', locations: ['public_qcazureasiase', 'public_qcawsuswest'], name: 'IBM Cloud'},
    {id: 'eu', locations: ['public_qcazureasiase', 'public_qcawsuswest'], name: 'Europe'},
    {id: 'azr', locations: ['public_qcazureasiase', 'public_qcawsuswest'], name: 'Microsoft Azure'},
    {id: 'na', locations: ['public_qcazureasiase', 'public_qcawsuswest'], name: 'North America'},
    {id: 'oc', locations: ['public_qcazureasiase'], name: 'Oceania'},
    {id: 'sa', locations: ['public_qcazureasiase', 'public_qcawsuswest'], name: 'South America'},
    {id: 'aws', locations: ['public_qcazureasiase', 'public_qcawsuswest'], name: 'Amazon AWS'},
    {
      id: 'all',
      locations: ['public_qcazureasiase', 'public_qcawsuswest', 'public_qcgoogleuscentral'],
      name: 'Worldwide',
    },
    {id: 'af', locations: ['public_azuresouthafricanorth'], name: 'Africa'},
    {id: 'ap', locations: ['public_qcazureasiase', 'public_qcawsuswest'], name: 'Asia-Pacfic'},
    {id: 'goo', locations: ['public_qcazureasiase', 'public_qcawsuswest'], name: 'Google Cloud'},
    {id: 'ww', locations: ['public_qcazureasiase', 'public_qcawsuswest'], name: null},
  ],
};

describe('schedules edit', () => {
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

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, scheduleResponse)
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            project_id: 'abc123',
            tags: [],
          },
          schedule: {
            backoff_method: null,
            frequency: 60,
            locations: [],
            regions: ['all'],
            target_ids: [],
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
            project_id: 'abc123',
            tags: [],
          },
          schedule: {
            backoff_method: null,
            frequency: 86_400,
            locations: [],
            regions: ['all'],
            target_ids: [],
          },
        })
        .reply(200, {})
    )
    .stdout()
    .command(['schedules:edit', '--schedule-id=abc123', '--interval=24h'])
    .it('Edit interval (h)');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/abc123/')
        .reply(200, scheduleResponse)
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'abc',
            project_id: 'abc123',
            tags: [],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
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
            project_id: 'abc123',
            tags: ['apimetrics:postman'],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
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
            project_id: 'abc123',
            tags: ['apimetrics:postman'],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
          },
        })
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            project_id: 'abc123',
            tags: [],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
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
            project_id: 'abc123',
            tags: ['apimetrics:backoff:fibo'],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
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
            project_id: 'abc123',
            tags: ['apimetrics:backoff:expo'],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
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
            project_id: 'abc123',
            tags: ['apimetrics:backoff:constant'],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
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
            project_id: 'abc123',
            tags: [],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
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
          id: 'abc123',
          meta: {
            created: '2023-05-17T00:48:56.286524Z',
            last_update: '2023-06-07T23:16:10.378774Z',
            name: 'schedule',
            owner: 'abc123',
            project_id: 'abc123',
            tags: [
              'apimetrics:backoff_base:10',
              'apimetrics:backoff_factor:10',
              'apimetrics:backoff_interval:10',
            ],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
          },
        })
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            project_id: 'abc123',
            tags: [
              'apimetrics:backoff_base:20',
              'apimetrics:backoff_factor:20',
              'apimetrics:backoff_interval:20',
            ],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
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
          id: 'abc123',
          meta: {
            created: '2023-05-17T00:48:56.286524Z',
            last_update: '2023-06-07T23:16:10.378774Z',
            name: 'schedule',
            owner: 'abc123',
            project_id: 'abc123',
            tags: [
              'apimetrics:backoff_base:10',
              'apimetrics:backoff_factor:10',
              'apimetrics:backoff_interval:10',
            ],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
          },
        })
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            project_id: 'abc123',
            tags: [
              'apimetrics:backoff_base:10',
              'apimetrics:backoff_factor:10',
              'apimetrics:backoff_interval:10',
            ],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
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
          id: 'abc123',
          meta: {
            created: '2023-05-17T00:48:56.286524Z',
            last_update: '2023-06-07T23:16:10.378774Z',
            name: 'schedule',
            owner: 'abc123',
            project_id: 'abc123',
            tags: [],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
          },
        })
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            project_id: 'abc123',
            tags: [
              'apimetrics:backoff_base:20',
              'apimetrics:backoff_factor:20',
              'apimetrics:backoff_interval:20',
            ],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
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
          id: 'abc123',
          meta: {
            created: '2023-05-17T00:48:56.286524Z',
            last_update: '2023-06-07T23:16:10.378774Z',
            name: 'schedule',
            owner: 'abc123',
            project_id: 'abc123',
            tags: [
              'apimetrics:backoff_max_retries:10',
              'apimetrics:backoff_skip_save:10',
              'apimetrics:backoff_skip_notifs:10',
            ],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
          },
        })
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            project_id: 'abc123',
            tags: [
              'apimetrics:backoff_max_retries:20',
              'apimetrics:backoff_skip_save:20',
              'apimetrics:backoff_skip_notifs:20',
            ],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
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
          id: 'abc123',
          meta: {
            created: '2023-05-17T00:48:56.286524Z',
            last_update: '2023-06-07T23:16:10.378774Z',
            name: 'schedule',
            owner: 'abc123',
            project_id: 'abc123',
            tags: [
              'apimetrics:backoff_max_retries:10',
              'apimetrics:backoff_skip_save:10',
              'apimetrics:backoff_skip_notifs:10',
            ],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
          },
        })
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            project_id: 'abc123',
            tags: [
              'apimetrics:backoff_max_retries:10',
              'apimetrics:backoff_skip_save:10',
              'apimetrics:backoff_skip_notifs:10',
            ],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
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
          id: 'abc123',
          meta: {
            created: '2023-05-17T00:48:56.286524Z',
            last_update: '2023-06-07T23:16:10.378774Z',
            name: 'schedule',
            owner: 'abc123',
            project_id: 'abc123',
            tags: [],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
          },
        })
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            project_id: 'abc123',
            tags: [
              'apimetrics:backoff_max_retries:20',
              'apimetrics:backoff_skip_save:20',
              'apimetrics:backoff_skip_notifs:20',
            ],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['all'],
            target_ids: [],
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
            project_id: 'abc123',
            tags: [],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: ['public_qcazureasiase'],
            regions: ['all', 'eu'],
            target_ids: [],
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
          id: 'abc123',
          meta: {
            created: '2023-05-17T00:48:56.286524Z',
            last_update: '2023-06-07T23:16:10.378774Z',
            name: 'schedule',
            owner: 'abc123',
            project_id: 'abc123',
            tags: [],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: ['public_qcazureasiase', 'public_qcawsuswest'],
            regions: ['eu', 'us'],
            target_ids: [],
          },
        })
        .get('/api/2/agents/info')
        .reply(200, info)
        .post('/api/2/schedules/abc123/', {
          meta: {
            name: 'schedule',
            project_id: 'abc123',
            tags: [],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: ['public_qcawsuswest'],
            regions: ['us'],
            target_ids: [],
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
