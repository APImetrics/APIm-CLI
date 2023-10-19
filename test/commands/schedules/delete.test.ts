import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

describe('schedules delete', () => {
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
      api.delete('/api/2/schedules/qwerty/').reply(200, {})
    )
    .stdout()
    .command(['schedules:delete', '--schedule-id=qwerty', '--json'])
    .it('Delete schedule', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
      });
    });

  auth
    .stderr()
    .command(['schedules:delete'])
    .catch((error) => {
      expect(error.message).to.contain('Missing required flag schedule-id');
    })
    .it('Missing required options');

  noProject
    .nock(
      'https://client.apimetrics.io',
      {reqheaders: {'Apimetrics-Project-Id': (val) => val === '123'}},
      (api) => api.delete('/api/2/schedules/qwerty/').reply(200, {})
    )
    .stdout()
    .command(['schedules:delete', '--schedule-id=qwerty', '--json', '-p=123'])
    .it('Delete schedule passing project ID', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
      });
    });
});
