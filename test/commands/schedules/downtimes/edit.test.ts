/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const downtime1 = {
  schedule: {
    start_time: '2023-09-29T14:54:41.865Z',
    end_time: '2023-09-30T14:54:41.865Z',
    repeated: false,
    repeat_days: 0,
  },
};

const downtime2 = {
  schedule: {
    start_time: '2023-09-29T14:54:41.865Z',
    end_time: '2023-09-30T14:54:41.865Z',
    repeated: true,
    repeat_days: 7,
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
        token: 'abc123',
        mode: 'bearer',
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
            start_time: '2023-09-30T14:54:41.865Z',
            end_time: '2023-10-01T14:54:41.865Z',
            repeated: false,
            repeat_days: 0,
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
            start_time: '2023-09-29T14:54:41.865Z',
            end_time: '2023-09-30T14:54:41.865Z',
            repeated: true,
            repeat_days: 1,
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
            start_time: '2023-09-29T14:54:41.865Z',
            end_time: '2023-09-30T14:54:41.865Z',
            repeated: true,
            repeat_days: 7,
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
            start_time: '2023-09-29T14:54:41.865Z',
            end_time: '2023-09-30T14:54:41.865Z',
            repeated: false,
            repeat_days: 0,
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
