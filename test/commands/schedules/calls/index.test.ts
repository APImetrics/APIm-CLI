/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const schedule = {
  meta: {},
  schedule: {
    target_ids: ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr'],
  },
};

const call = {
  id: 'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDAtKWRiAoM',
  meta: {
    accept: 'application/json',
    content_type: 'application/json',
    created: '2020-02-14T22:13:04.896102Z',
    description: 'Auto-generated API Call',
    domain: 'google.apimetrics.xyz',
    last_update: '2022-07-19T22:38:52.829696Z',
    name: 'Example HTTP POST Call',
    owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
    project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
    tags: [
      'sector:hobbyist',
      'apimetrics:meta:domain:google.apimetrics.xyz',
      'apimetrics:meta:http:google_lb',
      'apimetrics:meta:ns_host:Google+LLC',
      'apimetrics:meta:server:gunicorn',
      'api_type:update',
      'apimetrics:meta:host:Google+LLC',
    ],
    workspace: 'global',
  },
  request: {
    auth_id: null,
    body: '{"success": "Congratulations, this is your first APImetrics API Call!"}',
    headers: [
      {
        key: 'Accept',
        value: 'application/json',
      },
      {
        key: 'Content-Type',
        value: 'application/json',
      },
    ],
    method: 'POST',
    parameters: [],
    token_id: null,
    url: 'http://google.apimetrics.xyz/post',
  },
};

const callSansDescription = {
  id: 'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDAtKWRiAoM',
  meta: {
    accept: 'application/json',
    content_type: 'application/json',
    created: '2020-02-14T22:13:04.896102Z',
    domain: 'google.apimetrics.xyz',
    last_update: '2022-07-19T22:38:52.829696Z',
    name: 'Example HTTP POST Call',
    owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
    project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
    tags: [
      'sector:hobbyist',
      'apimetrics:meta:domain:google.apimetrics.xyz',
      'apimetrics:meta:http:google_lb',
      'apimetrics:meta:ns_host:Google+LLC',
      'apimetrics:meta:server:gunicorn',
      'api_type:update',
      'apimetrics:meta:host:Google+LLC',
    ],
    workspace: 'global',
  },
  request: {
    auth_id: null,
    body: '{"success": "Congratulations, this is your first APImetrics API Call!"}',
    headers: [
      {
        key: 'Accept',
        value: 'application/json',
      },
      {
        key: 'Content-Type',
        value: 'application/json',
      },
    ],
    method: 'POST',
    parameters: [],
    token_id: null,
    url: 'http://google.apimetrics.xyz/post',
  },
};

describe('schedules calls', () => {
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
      api.get('/api/2/schedules/abc123/').reply(200, schedule);

      // Async calls
      api.get('/api/2/calls/abc/').reply(200, call);
      api.get('/api/2/calls/def/').reply(200, call);
      api.get('/api/2/calls/ghi/').reply(200, call);
      api.get('/api/2/calls/jkl/').reply(200, call);
      api.get('/api/2/calls/mno/').reply(200, call);
      api.get('/api/2/calls/pqr/').reply(200, callSansDescription);
    })
    .stdout()
    .command(['schedules:calls', '--output=json', '--schedule-id=abc123'])
    .it('List calls with --output=json argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          description: 'Auto-generated API Call',
          method: 'POST',
          name: 'Example HTTP POST Call',
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          description: 'Auto-generated API Call',
          method: 'POST',
          name: 'Example HTTP POST Call',
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          description: 'Auto-generated API Call',
          method: 'POST',
          name: 'Example HTTP POST Call',
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          description: 'Auto-generated API Call',
          method: 'POST',
          name: 'Example HTTP POST Call',
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          description: 'Auto-generated API Call',
          method: 'POST',
          name: 'Example HTTP POST Call',
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          description: '',
          method: 'POST',
          name: 'Example HTTP POST Call',
          url: 'http://google.apimetrics.xyz/post',
        },
      ]);
    });

  noProject
    .nock(
      'https://client.apimetrics.io',
      {reqheaders: {'Apimetrics-Project-Id': (val) => val === 'qwerty'}},
      (api) => {
        api.get('/api/2/schedules/abc123/').reply(200, schedule);

        // Async calls
        api.get('/api/2/calls/abc/').reply(200, call);
        api.get('/api/2/calls/def/').reply(200, call);
        api.get('/api/2/calls/ghi/').reply(200, call);
        api.get('/api/2/calls/jkl/').reply(200, call);
        api.get('/api/2/calls/mno/').reply(200, call);
        api.get('/api/2/calls/pqr/').reply(200, call);
      }
    )
    .stdout()
    .command(['schedules:calls', '--output=json', '--schedule-id=abc123', '-p=qwerty'])
    .it('List calls with --output=json argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          description: 'Auto-generated API Call',
          method: 'POST',
          name: 'Example HTTP POST Call',
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          description: 'Auto-generated API Call',
          method: 'POST',
          name: 'Example HTTP POST Call',
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          description: 'Auto-generated API Call',
          method: 'POST',
          name: 'Example HTTP POST Call',
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          description: 'Auto-generated API Call',
          method: 'POST',
          name: 'Example HTTP POST Call',
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          description: 'Auto-generated API Call',
          method: 'POST',
          name: 'Example HTTP POST Call',
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          description: 'Auto-generated API Call',
          method: 'POST',
          name: 'Example HTTP POST Call',
          url: 'http://google.apimetrics.xyz/post',
        },
      ]);
    });

  auth
    .stderr()
    .command(['schedules:calls'])
    .catch((error) => {
      expect(error.message).to.contain('Missing required flag schedule-id');
    })
    .it('Missing required options');
});
