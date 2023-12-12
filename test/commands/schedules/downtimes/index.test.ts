/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const scheduleResponse = {
  meta: {},
  results: [{id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}],
};

const downtimes1 = {
  meta: {},
  results: [
    {
      id: 'abc123',
      meta: {
        schedule_id: '1',
      },
      schedule: {
        end_time: '2023-09-30T14:54:41.865000Z',
        repeat_days: 0,
        start_time: '2023-09-29T14:54:41.865000Z',
      },
    },
    {
      id: 'abc123',
      meta: {
        schedule_id: '1',
      },
      schedule: {
        end_time: '2023-09-30T14:54:41.865000Z',
        repeat_days: 7,
        start_time: '2023-09-29T14:54:41.865000Z',
      },
    },
  ],
};

const downtimes2 = {
  meta: {},
  results: [
    {
      id: 'abc123',
      meta: {
        schedule_id: '2',
      },
      schedule: {
        end_time: '2023-09-30T14:54:41.865000Z',
        repeat_days: 10,
        start_time: '2023-09-29T14:54:41.865000Z',
      },
    },
    {
      id: 'abc123',
      meta: {
        schedule_id: '2',
      },
      schedule: {
        end_time: '2023-09-30T14:54:41.865000Z',
        repeat_days: 1,
        start_time: '2023-09-29T14:54:41.865000Z',
      },
    },
  ],
};

const downtimeEmpty = {
  meta: {},
  results: [],
};

describe('schedules downtimes', () => {
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
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/schedules/').reply(200, scheduleResponse);

      // Async calls
      api.get('/api/2/schedules/1/downtime/').reply(200, downtimes1);
      api.get('/api/2/schedules/2/downtime/').reply(200, downtimes2);
      api.get('/api/2/schedules/3/downtime/').reply(200, downtimeEmpty);
      api.get('/api/2/schedules/4/downtime/').reply(200, downtimeEmpty);
    })
    .stdout()
    .command(['schedules:downtimes', '--output=json'])
    .it('List all downtimes with --output=json argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          end: '2023-09-30T14:54:41.865000Z',
          id: 'abc123',
          repeat: 'never',
          scheduleId: '1',
          start: '2023-09-29T14:54:41.865000Z',
        },
        {
          end: '2023-09-30T14:54:41.865000Z',
          id: 'abc123',
          repeat: 'weekly',
          scheduleId: '1',
          start: '2023-09-29T14:54:41.865000Z',
        },
        {
          end: '2023-09-30T14:54:41.865000Z',
          id: 'abc123',
          repeat: 'Every 10 days',
          scheduleId: '2',
          start: '2023-09-29T14:54:41.865000Z',
        },
        {
          end: '2023-09-30T14:54:41.865000Z',
          id: 'abc123',
          repeat: 'daily',
          scheduleId: '2',
          start: '2023-09-29T14:54:41.865000Z',
        },
      ]);
    });

  noProject
    .nock(
      'https://client.apimetrics.io',
      {reqheaders: {'Apimetrics-Project-Id': (val) => val === 'abc123'}},
      (api) => {
        api.get('/api/2/schedules/').reply(200, scheduleResponse);

        // Async calls
        api.get('/api/2/schedules/1/downtime/').reply(200, downtimes1);
        api.get('/api/2/schedules/2/downtime/').reply(200, downtimes2);
        api.get('/api/2/schedules/3/downtime/').reply(200, downtimeEmpty);
        api.get('/api/2/schedules/4/downtime/').reply(200, downtimeEmpty);
      }
    )
    .stdout()
    .command(['schedules:downtimes', '--output=json', '-p=abc123'])
    .it('List all downtimes with --output=json argument passing project ID', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          end: '2023-09-30T14:54:41.865000Z',
          id: 'abc123',
          repeat: 'never',
          scheduleId: '1',
          start: '2023-09-29T14:54:41.865000Z',
        },
        {
          end: '2023-09-30T14:54:41.865000Z',
          id: 'abc123',
          repeat: 'weekly',
          scheduleId: '1',
          start: '2023-09-29T14:54:41.865000Z',
        },
        {
          end: '2023-09-30T14:54:41.865000Z',
          id: 'abc123',
          repeat: 'Every 10 days',
          scheduleId: '2',
          start: '2023-09-29T14:54:41.865000Z',
        },
        {
          end: '2023-09-30T14:54:41.865000Z',
          id: 'abc123',
          repeat: 'daily',
          scheduleId: '2',
          start: '2023-09-29T14:54:41.865000Z',
        },
      ]);
    });
});
