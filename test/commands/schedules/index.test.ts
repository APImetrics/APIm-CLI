/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const scheduleResponse = {
  meta: {},
  results: [
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Mmfl8ULDA',
      meta: {
        created: '2023-06-24T19:16:16.307068Z',
        last_update: '2023-06-24T19:20:40.738289Z',
        name: 'AWS Only',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['apimetrics:backoff:constant'],
      },
      schedule: {
        backoff_method: 'constant',
        frequency: 43_200,
        locations: [],
        regions: ['aws'],
        target_ids: [],
      },
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4IGp8NMLDA',
      meta: {
        created: '2023-05-17T00:48:56.286524Z',
        last_update: '2023-06-07T23:16:10.378774Z',
        name: 'Default Schedule',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['importer:default-schedule'],
      },
      schedule: {
        backoff_method: null,
        frequency: 300,
        locations: [],
        regions: ['all'],
        target_ids: ['ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDg3vX4ggsM'],
      },
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Im7m58JDA',
      meta: {
        created: '2023-06-24T19:30:22.474393Z',
        last_update: '2023-06-24T19:30:22.474401Z',
        name: 'Expo',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['apimetrics:backoff:expo'],
      },
      schedule: {
        backoff_method: 'expo',
        frequency: 600,
        locations: [],
        regions: ['all'],
        target_ids: [],
      },
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4JmAuYMJDA',
      meta: {
        created: '2023-06-24T19:30:12.379860Z',
        last_update: '2023-06-24T19:30:12.379868Z',
        name: 'Fibo',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['apimetrics:backoff:fibo'],
      },
      schedule: {
        backoff_method: 'fibo',
        frequency: 30,
        locations: ['aws_europe_1', 'google_america_2'],
        regions: ['all'],
        target_ids: [],
      },
    },
  ],
};

describe('schedules', () => {
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
      api.get('/api/2/schedules/').reply(200, scheduleResponse)
    )
    .stdout()
    .command(['schedules', '--output=json'])
    .it('List all schedules with --output=json argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          frequency: 'Every 12 hours',
          locations: '',
          name: 'AWS Only',
          regions: 'aws',
        },
        {
          frequency: 'Every 5 minutes',
          locations: '',
          name: 'Default Schedule',
          regions: 'all',
        },
        {
          frequency: 'Every 10 minutes',
          locations: '',
          name: 'Expo',
          regions: 'all',
        },
        {
          frequency: 'Every 30 seconds',
          locations: 'aws_europe_1, google_america_2',
          name: 'Fibo',
          regions: 'all',
        },
      ]);
    });

  noProject
    .nock(
      'https://client.apimetrics.io',
      {reqheaders: {'Apimetrics-Project-Id': (val) => val === 'abc123'}},
      (api) => api.get('/api/2/schedules/').reply(200, scheduleResponse)
    )
    .stdout()
    .command(['schedules', '--output=json', '-p', 'abc123'])
    .it('Pass --project-id argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          frequency: 'Every 12 hours',
          locations: '',
          name: 'AWS Only',
          regions: 'aws',
        },
        {
          frequency: 'Every 5 minutes',
          locations: '',
          name: 'Default Schedule',
          regions: 'all',
        },
        {
          frequency: 'Every 10 minutes',
          locations: '',
          name: 'Expo',
          regions: 'all',
        },
        {
          frequency: 'Every 30 seconds',
          locations: 'aws_europe_1, google_america_2',
          name: 'Fibo',
          regions: 'all',
        },
      ]);
    });
});
