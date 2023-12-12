/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const downtime1 = {
  schedule: {
    end_time: '2023-09-30T14:54:41.865Z',
    repeat_days: 0,
    repeated: false,
    start_time: '2023-09-29T14:54:41.865Z',
  },
};

const downtime2 = {
  schedule: {
    end_time: '2023-09-30T14:54:41.865Z',
    repeat_days: 7,
    repeated: true,
    start_time: '2023-09-29T14:54:41.865Z',
  },
};

describe('schedules downtimes edit', () => {
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

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/downtime/1/')
        .reply(200, downtime1)
        .post('/api/2/schedules/downtime/1/', {
          downtime: {
            end_time: '2023-10-01T14:54:41.865Z',
            repeat_days: 0,
            repeated: false,
            start_time: '2023-09-30T14:54:41.865Z',
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command([
      'schedules:downtimes:edit',
      '--downtime-id=1',
      '--start=2023-09-30T14:54:41.865Z',
      '--end=2023-10-01T14:54:41.865Z',
    ])
    .it('Edit start and end');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/downtime/1/')
        .reply(200, downtime1)
        .post('/api/2/schedules/downtime/1/', {
          downtime: {
            end_time: '2023-09-30T14:54:41.865Z',
            repeat_days: 1,
            repeated: true,
            start_time: '2023-09-29T14:54:41.865Z',
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['schedules:downtimes:edit', '--downtime-id=1', '--repeat=daily'])
    .it('Daily repeat');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/downtime/1/')
        .reply(200, downtime1)
        .post('/api/2/schedules/downtime/1/', {
          downtime: {
            end_time: '2023-09-30T14:54:41.865Z',
            repeat_days: 7,
            repeated: true,
            start_time: '2023-09-29T14:54:41.865Z',
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['schedules:downtimes:edit', '--downtime-id=1', '--repeat=weekly'])
    .it('Weekly repeat');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api
        .get('/api/2/schedules/downtime/1/')
        .reply(200, downtime2)
        .post('/api/2/schedules/downtime/1/', {
          downtime: {
            end_time: '2023-09-30T14:54:41.865Z',
            repeat_days: 0,
            repeated: false,
            start_time: '2023-09-29T14:54:41.865Z',
          },
        })
        .reply(200, {id: 'abc123'})
    )
    .stdout()
    .command(['schedules:downtimes:edit', '--downtime-id=1', '--repeat=off'])
    .it('Repeat off');

  bearerAuth
    .stderr()
    .command(['schedules:downtimes:edit'])
    .catch((error) => {
      expect(error.message).to.contain('Missing required flag downtime-id');
    })
    .it('Missing required flags');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/schedules/downtime/1/').reply(200, downtime1)
    )
    .stderr()
    .command([
      'schedules:downtimes:edit',
      '--downtime-id=1',
      '--end=2023-09-29T14:54:41.865Z',
      '--start=2023-09-30T14:54:41.865Z',
    ])
    .catch((error) => {
      expect(error.message).to.contain(
        'End date (2023-09-29T14:54:41.865Z) is before start date (2023-09-30T14:54:41.865Z)'
      );
    })
    .it('End before start');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/schedules/downtime/1/').reply(200, downtime1)
    )
    .stderr()
    .command([
      'schedules:downtimes:edit',
      '--downtime-id=1',
      '--end=2023-09-29T14:54:41.865Z',
      '--start=abc123',
    ])
    .catch((error) => {
      expect(error.message).to.contain(
        'Invalid value for start. Could not parse abc123 into a date and time.'
      );
    })
    .it('Invalid start');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/schedules/downtime/1/').reply(200, downtime1)
    )
    .stderr()
    .command([
      'schedules:downtimes:edit',
      '--downtime-id=1',
      '--start=2023-09-29T14:54:41.865Z',
      '--end=abc123',
    ])
    .catch((error) => {
      expect(error.message).to.contain(
        'Invalid value for end. Could not parse abc123 into a date and time.'
      );
    })
    .it('Invalid end');
});
