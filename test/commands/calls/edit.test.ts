/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

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
    headers: [
      {
        key: 'Content-type',
        value: 'application/json',
      },
    ],
    token_id: null,
    method: 'GET',
  },
  id: 'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDA05v5mwoM',
};

const updateRequest = {
  meta: {
    name: '=1+1',
    description: null,
    tags: [
      'apimetrics:meta:domain:google.apimetrics.xyz',
      'apimetrics:meta:http:google_lb',
      'apimetrics:meta:ns_host:Google+LLC',
      'apimetrics:meta:server:gunicorn',
      'bob',
    ],
  },
  request: {
    method: 'GET',
    url: 'http://google.apimetrics.xyz/get',
    headers: [
      {key: 'Content-type', value: ' application/json'},
      {key: 'Some-random-header', value: ' some random value'},
      {key: 'Accept', value: 'application/json'},
    ],
  },
};

describe('edit calls', () => {
  const auth = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organisation: {current: 'abc123'},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'key',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});

  auth
    .stderr()
    .command(['calls:edit', '--json'])
    .catch((error) => {
      expect(error.message).to.contain('Must specify --call-id in non-interactive mode.');
    })
    .it('Non interactive mode without --call-id');

  auth
    .stdout()
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/calls/1234/').reply(200, callsResponse);
      api.post('/api/2/calls/1234/', updateRequest).reply(200, callsResponse);
    })
    .command([
      'calls:edit',
      '--json',
      '--call-id',
      '1234',
      '--accept',
      'application/json',
      '--remove-tag',
      'dave',
      '--remove-tag',
      'apimetrics:meta:host:Google+LLC',
      '--add-tag',
      'bob',
      '--replace-header',
      'Content-type: application/json',
      '--add-header',
      'Some-random-header: some random value',
      '--remove-header',
      'Poor-header',
    ])
    .it(
      'Update API call');
});
