/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const scheduleResponse = {
  meta: {
    name: 'schedule',
    created: '2023-05-17T00:48:56.286524Z',
    tags: ['importer:default-schedule'],
    last_update: '2023-06-07T23:16:10.378774Z',
    owner: 'abc123',
    project_id: 'abc123',
  },
  id: 'qwerty',
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

describe('schedules create', () => {
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
      expect(output).to.deep.equal({success: true, schedule: scheduleResponse});
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
      expect(output).to.deep.equal({success: true, schedule: scheduleResponse});
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
      expect(output).to.deep.equal({success: true, schedule: scheduleResponse});
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
      expect(output).to.deep.equal({success: true, schedule: scheduleResponse});
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
      expect(output).to.deep.equal({success: true, schedule: scheduleResponse});
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
      expect(output).to.deep.equal({success: true, schedule: scheduleResponse});
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
      expect(output).to.deep.equal({success: true, schedule: scheduleResponse});
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
      expect(output).to.deep.equal({success: true, schedule: scheduleResponse});
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
      expect(output).to.deep.equal({success: true, schedule: scheduleResponse});
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
      expect(output).to.deep.equal({success: true, schedule: scheduleResponse});
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
      expect(output).to.deep.equal({success: true, schedule: scheduleResponse});
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
      expect(output).to.deep.equal({success: true, schedule: scheduleResponse});
    });
});
