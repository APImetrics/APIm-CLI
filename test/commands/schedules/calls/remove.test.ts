import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const schedule = {
  id: 'qwerty',
};

describe('schedules calls remove', () => {
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
      api.delete('/api/2/schedules/abc123/call/def456').reply(200, schedule)
    )
    .stdout()
    .command(['schedules:calls:remove', '--schedule-id=abc123', '--call-id=def456', '--json'])
    .it('Remove call from schedule', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        schedule: {id: 'qwerty'},
      });
    });

  auth
    .stderr()
    .command(['schedules:calls:remove'])
    .catch((error) => {
      expect(error.message)
        .to.contain('Missing required flag schedule-id')
        .and.to.contain('Missing required flag call-id');
    })
    .it('Missing required options');

  noProject
    .nock(
      'https://client.apimetrics.io',
      {reqheaders: {'Apimetrics-Project-Id': (val) => val === '123'}},
      (api) => api.delete('/api/2/schedules/abc123/call/def456').reply(200, schedule)
    )
    .stdout()
    .command([
      'schedules:calls:remove',
      '--schedule-id=abc123',
      '--call-id=def456',
      '-p=123',
      '--json',
    ])
    .it('Passing project ID inline', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        schedule: {id: 'qwerty'},
      });
    });
});