/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import {auth, noProject} from '../../helpers/auth';

const callsResponse = {
  meta: {
    domain: 'google.apimetrics.xyz',
    description: null,
    tags: [
      'apimetrics:meta:domain:google.apimetrics.xyz',
      'apimetrics:meta:http:google_lb',
      'apimetrics:meta:ns_host:Google+LLC',
      'apimetrics:meta:server:gunicorn',
      'apimetrics:meta:host:Google+LLC',
    ],
    accept: null,
    content_type: null,
    owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
    name: '=1+1',
    created: '2021-01-28T01:19:19.594763Z',
    last_update: '2022-07-19T22:38:53.838839Z',
    workspace: 'global',
    project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
  },
  request: {
    body: null,
    parameters: [],
    url: 'http://google.apimetrics.xyz/get',
    auth_id: null,
    headers: [],
    token_id: null,
    method: 'GET',
  },
  id: 'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDA05v5mwoM',
};

const advancedCreateRequest = {
  meta: {name: '=1+1', tags: ['bob', 'dave']},
  request: {
    method: 'GET',
    url: 'http://google.apimetrics.xyz/get',
    headers: [
      {key: 'Content-type', value: ' application/json'},
      {key: 'Accept', value: 'application/json'},
    ],
  },
};

describe('calls create', () => {
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
            method: 'POST',
            url: 'http://google.apimetrics.xyz/get',
            headers: [
              {key: 'Content-Type', value: 'text/plain'},
              {key: 'Accept', value: 'application/json'},
            ],
            body: 'abc123456',
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
            method: 'POST',
            url: 'http://google.apimetrics.xyz/get',
            headers: [
              {key: 'Content-Type', value: 'application/json'},
              {key: 'Accept', value: 'application/json'},
            ],
            body: 'abc123456',
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
