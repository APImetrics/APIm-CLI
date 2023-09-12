/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const scheduleResponse = {
  meta: {},
  results: [
    {
      meta: {
        name: 'AWS Only',
        created: '2023-06-24T19:16:16.307068Z',
        tags: ['apimetrics:backoff:constant'],
        last_update: '2023-06-24T19:20:40.738289Z',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Mmfl8ULDA',
      schedule: {
        regions: ['aws'],
        frequency: 43_200,
        locations: [],
        target_ids: [],
        backoff_method: 'constant',
      },
    },
    {
      meta: {
        name: 'Default Schedule',
        created: '2023-05-17T00:48:56.286524Z',
        tags: ['importer:default-schedule'],
        last_update: '2023-06-07T23:16:10.378774Z',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4IGp8NMLDA',
      schedule: {
        regions: ['all'],
        frequency: 300,
        locations: [],
        target_ids: ['ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDg3vX4ggsM'],
        backoff_method: null,
      },
    },
    {
      meta: {
        name: 'Expo',
        created: '2023-06-24T19:30:22.474393Z',
        tags: ['apimetrics:backoff:expo'],
        last_update: '2023-06-24T19:30:22.474401Z',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Im7m58JDA',
      schedule: {
        regions: ['all'],
        frequency: 600,
        locations: [],
        target_ids: [],
        backoff_method: 'expo',
      },
    },
    {
      meta: {
        name: 'Fibo',
        created: '2023-06-24T19:30:12.379860Z',
        tags: ['apimetrics:backoff:fibo'],
        last_update: '2023-06-24T19:30:12.379868Z',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4JmAuYMJDA',
      schedule: {
        regions: ['all'],
        frequency: 600,
        locations: [],
        target_ids: [],
        backoff_method: 'fibo',
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
      api.get('/api/2/schedules/').reply(200, scheduleResponse)
    )
    .stdout()
    .command(['schedules', '--output=json'])
    .it('List all schedules with --output=json argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          name: 'AWS Only',
          frequency: 'Every 12 hours',
          regions: 'aws',
        },
        {
          name: 'Default Schedule',
          frequency: 'Every 5 minutes',
          regions: 'all',
        },
        {
          name: 'Expo',
          frequency: 'Every 10 minutes',
          regions: 'all',
        },
        {
          name: 'Fibo',
          frequency: 'Every 10 minutes',
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
          name: 'AWS Only',
          frequency: 'Every 12 hours',
          regions: 'aws',
        },
        {
          name: 'Default Schedule',
          frequency: 'Every 5 minutes',
          regions: 'all',
        },
        {
          name: 'Expo',
          frequency: 'Every 10 minutes',
          regions: 'all',
        },
        {
          name: 'Fibo',
          frequency: 'Every 10 minutes',
          regions: 'all',
        },
      ]);
    });
});
