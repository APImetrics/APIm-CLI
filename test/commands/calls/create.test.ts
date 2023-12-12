/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const callsResponse = {
  id: 'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDA05v5mwoM',
  meta: {
    accept: null,
    content_type: null,
    created: '2021-01-28T01:19:19.594763Z',
    description: null,
    domain: 'google.apimetrics.xyz',
    last_update: '2022-07-19T22:38:53.838839Z',
    name: '=1+1',
    owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
    project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
    tags: [
      'apimetrics:meta:domain:google.apimetrics.xyz',
      'apimetrics:meta:http:google_lb',
      'apimetrics:meta:ns_host:Google+LLC',
      'apimetrics:meta:server:gunicorn',
      'apimetrics:meta:host:Google+LLC',
    ],
    workspace: 'global',
  },
  request: {
    auth_id: null,
    body: null,
    headers: [],
    method: 'GET',
    parameters: [],
    token_id: null,
    url: 'http://google.apimetrics.xyz/get',
  },
};

const advancedCreateRequest = {
  meta: {name: '=1+1', tags: ['bob', 'dave']},
  request: {
    headers: [
      {key: 'Content-type', value: ' application/json'},
      {key: 'Accept', value: 'application/json'},
    ],
    method: 'GET',
    url: 'http://google.apimetrics.xyz/get',
  },
};

describe('calls create', () => {
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
      api.post('/api/2/calls/').reply(200, callsResponse)
    )
    .stdout()
    .command(['calls:create', '--json', '-n', '=1+1', '-u', 'http://google.apimetrics.xyz/get'])
    .it('Create call with minimum options (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal(callsResponse);
    });
  auth
    .stdout()
    .nock('https://client.apimetrics.io', (api) =>
      api.post('/api/2/calls/', advancedCreateRequest).reply(200, {id: '1234'})
    )
    .command([
      'calls:create',
      '--json',
      '-n',
      '=1+1',
      '-u',
      'http://google.apimetrics.xyz/get',
      '--accept',
      'application/json',
      '--tag',
      'bob',
      '--tag',
      'dave',
      '--tag',
      'dave',
      '--header',
      'Content-type: application/json',
    ])
    .it('Create call with headers and tags');

  auth
    .stdout()
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/calls/', {
          meta: {name: 'call', tags: []},
          request: {
            body: 'abc123456',
            headers: [
              {key: 'Content-Type', value: 'text/plain'},
              {key: 'Accept', value: 'application/json'},
            ],
            method: 'POST',
            url: 'http://google.apimetrics.xyz/get',
          },
        })
        .reply(200, {id: '1234'})
    )
    .command([
      'calls:create',
      '--json',
      '-n',
      'call',
      '--method',
      'POST',
      '-u',
      'http://google.apimetrics.xyz/get',
      '--accept',
      'application/json',
      '--header',
      'Content-Type:text/plain',
      '--body',
      'abc123456',
    ])
    .it('Send body setting content type');

  auth
    .stdout()
    .nock('https://client.apimetrics.io', (api) =>
      api
        .post('/api/2/calls/', {
          meta: {name: 'call', tags: []},
          request: {
            body: 'abc123456',
            headers: [
              {key: 'Content-Type', value: 'application/json'},
              {key: 'Accept', value: 'application/json'},
            ],
            method: 'POST',
            url: 'http://google.apimetrics.xyz/get',
          },
        })
        .reply(200, {id: '1234'})
    )
    .command([
      'calls:create',
      '--json',
      '-n',
      'call',
      '--method',
      'POST',
      '-u',
      'http://google.apimetrics.xyz/get',
      '--accept',
      'application/json',
      '--body',
      'abc123456',
    ])
    .it('Send body default content type');

  auth
    .stderr()
    .command([
      'calls:create',
      '--json',
      '-n',
      '=1+1',
      '-u',
      'http://google.apimetrics.xyz/get',
      '--header',
      'Content-type application/json',
    ])
    .catch((error) => {
      expect(error.message).to.contain('Could not parse header Content-type application/json');
    })
    .it('Create call with invalid header');

  noProject
    .nock(
      'https://client.apimetrics.io',
      {reqheaders: {'Apimetrics-Project-Id': (val) => val === 'abc123'}},
      (api) => api.post('/api/2/calls/').reply(200, callsResponse)
    )
    .stdout()
    .command([
      'calls:create',
      '--json',
      '-n',
      '=1+1',
      '-u',
      'http://google.apimetrics.xyz/get',
      '-p',
      'abc123',
    ])
    .it('Create basic call passing project ID', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal(callsResponse);
    });
});
