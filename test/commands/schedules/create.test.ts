/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const scheduleResponse = {
  id: 'qwerty',
  meta: {
    created: '2023-05-17T00:48:56.286524Z',
    last_update: '2023-06-07T23:16:10.378774Z',
    name: 'schedule',
    owner: 'abc123',
    project_id: 'abc123',
    tags: ['importer:default-schedule'],
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

describe('schedules create', () => {
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
        .post('/api/2/schedules/', {
          meta: {name: 'schedule', tags: []},
          schedule: {backoff_method: null, frequency: 300, locations: [], regions: ['all']},
        })
        .reply(200, scheduleResponse)
    )
    .stdout()
    .command(['schedules:create', '--name=schedule', '--interval=5m', '--json'])
    .it('Create minimal schedule', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({schedule: scheduleResponse, success: true});
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/schedules/', {
          meta: {name: 'schedule', tags: []},
          schedule: {backoff_method: null, frequency: 86_400, locations: [], regions: ['all']},
        })
        .reply(200, scheduleResponse)
    )
    .stdout()
    .command(['schedules:create', '--name=schedule', '--interval=24h', '--json'])
    .it('Create minimal schedule with 24h interval', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({schedule: scheduleResponse, success: true});
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/schedules/', {
          meta: {name: 'schedule', tags: ['apimetrics:postman']},
          schedule: {backoff_method: null, frequency: 300, locations: [], regions: ['all']},
        })
        .reply(200, scheduleResponse)
    )
    .stdout()
    .command(['schedules:create', '--name=schedule', '--interval=5m', '--json', '--postman'])
    .it('Postman flag', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({schedule: scheduleResponse, success: true});
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/schedules/', {
          meta: {name: 'schedule', tags: ['apimetrics:backoff:fibo']},
          schedule: {backoff_method: null, frequency: 300, locations: [], regions: ['all']},
        })
        .reply(200, scheduleResponse)
    )
    .stdout()
    .command([
      'schedules:create',
      '--name=schedule',
      '--interval=5m',
      '--json',
      '--retry-method=fibonacci',
    ])
    .it('Fibonacci retry', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({schedule: scheduleResponse, success: true});
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/schedules/', {
          meta: {name: 'schedule', tags: ['apimetrics:backoff:expo']},
          schedule: {backoff_method: null, frequency: 300, locations: [], regions: ['all']},
        })
        .reply(200, scheduleResponse)
    )
    .stdout()
    .command([
      'schedules:create',
      '--name=schedule',
      '--interval=5m',
      '--json',
      '--retry-method=exponential',
    ])
    .it('Exponential retry minimal', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({schedule: scheduleResponse, success: true});
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/schedules/', {
          meta: {
            name: 'schedule',
            tags: [
              'apimetrics:backoff:expo',
              'apimetrics:backoff_base:10',
              'apimetrics:backoff_factor:10',
            ],
          },
          schedule: {backoff_method: null, frequency: 300, locations: [], regions: ['all']},
        })
        .reply(200, scheduleResponse)
    )
    .stdout()
    .command([
      'schedules:create',
      '--name=schedule',
      '--interval=5m',
      '--json',
      '--retry-method=exponential',
      '--retry-base=10',
      '--retry-factor=10',
    ])
    .it('Exponential retry full options', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({schedule: scheduleResponse, success: true});
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/schedules/', {
          meta: {name: 'schedule', tags: ['apimetrics:backoff:constant']},
          schedule: {backoff_method: null, frequency: 300, locations: [], regions: ['all']},
        })
        .reply(200, scheduleResponse)
    )
    .stdout()
    .command([
      'schedules:create',
      '--name=schedule',
      '--interval=5m',
      '--json',
      '--retry-method=constant',
    ])
    .it('Constant retry minimal', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({schedule: scheduleResponse, success: true});
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/schedules/', {
          meta: {
            name: 'schedule',
            tags: ['apimetrics:backoff:constant', 'apimetrics:backoff_interval:10'],
          },
          schedule: {backoff_method: null, frequency: 300, locations: [], regions: ['all']},
        })
        .reply(200, scheduleResponse)
    )
    .stdout()
    .command([
      'schedules:create',
      '--name=schedule',
      '--interval=5m',
      '--json',
      '--retry-method=constant',
      '--retry-interval=10',
    ])
    .it('Constant retry full options', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({schedule: scheduleResponse, success: true});
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/schedules/', {
          meta: {
            name: 'schedule',
            tags: [
              'apimetrics:backoff_max_retries:10',
              'apimetrics:backoff_skip_save:10',
              'apimetrics:backoff_skip_notifs:10',
            ],
          },
          schedule: {backoff_method: null, frequency: 300, locations: [], regions: ['all']},
        })
        .reply(200, scheduleResponse)
    )
    .stdout()
    .command([
      'schedules:create',
      '--name=schedule',
      '--interval=5m',
      '--json',
      '--max-retries=10',
      '--ignore-in-stats=10',
      '--skip-notifications=10',
    ])
    .it('General retry options', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({schedule: scheduleResponse, success: true});
    });

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/agents/info')
        .reply(200, info)
        .post('/api/2/schedules/', {
          meta: {
            name: 'schedule',
            tags: [],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: ['public_qcawsuswest', 'public_qcgoogleuscentral'],
            regions: [],
          },
        })
        .reply(200, scheduleResponse)
    )
    .stdout()
    .command([
      'schedules:create',
      '--name=schedule',
      '--interval=5m',
      '--json',
      '--location=public_qcawsuswest',
      '--location=public_qcgoogleuscentral',
    ])
    .it('Specify locations', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({schedule: scheduleResponse, success: true});
    });

  auth
    .nock('https://client.apimetrics.io', (api) => api.get('/api/2/agents/info').reply(200, info))
    .stderr()
    .command([
      'schedules:create',
      '--name=schedule',
      '--interval=5m',
      '--json',
      '--location=public_qcawsuswest',
      '--location=qwerty',
    ])
    .catch((error) => {
      expect(error.message).to.contain(
        "Invalid location qwerty. Run 'apimetrics info locations' to see valid locations."
      );
    })
    .it('Invalid location');

  auth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/agents/info')
        .reply(200, info)
        .post('/api/2/schedules/', {
          meta: {
            name: 'schedule',
            tags: [],
          },
          schedule: {
            backoff_method: null,
            frequency: 300,
            locations: [],
            regions: ['sft', 'eu'],
          },
        })
        .reply(200, scheduleResponse)
    )
    .stdout()
    .command([
      'schedules:create',
      '--name=schedule',
      '--interval=5m',
      '--json',
      '--region=sft',
      '--region=eu',
    ])
    .it('Specify regions', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({schedule: scheduleResponse, success: true});
    });

  auth
    .nock('https://client.apimetrics.io', (api) => api.get('/api/2/agents/info').reply(200, info))
    .stderr()
    .command([
      'schedules:create',
      '--name=schedule',
      '--interval=5m',
      '--json',
      '--region=sft',
      '--region=qwerty',
    ])
    .catch((error) => {
      expect(error.message).to.contain(
        "Invalid region qwerty. Run 'apimetrics info regions' to see valid region IDs."
      );
    })
    .it('Invalid region');

  noProject
    .nock(
      'https://client.apimetrics.io',
      {reqheaders: {'Apimetrics-Project-Id': (val) => val === 'abc123'}},
      (api) =>
        api
          .post('/api/2/schedules/', {
            meta: {name: 'schedule', tags: []},
            schedule: {backoff_method: null, frequency: 300, locations: [], regions: ['all']},
          })
          .reply(200, scheduleResponse)
    )
    .stdout()
    .command([
      'schedules:create',
      '--project-id=abc123',
      '--name=schedule',
      '--interval=5m',
      '--json',
    ])
    .it('Pass --project-id flag', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({schedule: scheduleResponse, success: true});
    });
});
