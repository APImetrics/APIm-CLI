/* eslint-disable camelcase */
import {test} from '@oclif/test';
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
    headers: [
      {
        key: 'Content-type',
        value: 'application/json',
      },
    ],
    method: 'GET',
    parameters: [],
    token_id: null,
    url: 'http://google.apimetrics.xyz/get',
  },
};

const updateRequest = {
  meta: {
    description: null,
    name: '=1+1',
    tags: [
      'apimetrics:meta:domain:google.apimetrics.xyz',
      'apimetrics:meta:http:google_lb',
      'apimetrics:meta:ns_host:Google+LLC',
      'apimetrics:meta:server:gunicorn',
      'bob',
    ],
  },
  request: {
    body: null,
    headers: [
      {key: 'Content-type', value: ' application/json'},
      {key: 'Some-random-header', value: ' some random value'},
      {key: 'Accept', value: 'application/json'},
    ],
    method: 'GET',
    url: 'http://google.apimetrics.xyz/get',
  },
};

describe('calls edit', () => {
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
    .it('Add and remove tags and headers');

  auth
    .stdout()
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/calls/1234/').reply(200, {
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
          headers: [
            {
              key: 'Content-type',
              value: 'text/plain',
            },
          ],
          method: 'GET',
          parameters: [],
          token_id: null,
          url: 'http://google.apimetrics.xyz/get',
        },
      });
      api
        .post('/api/2/calls/1234/', {
          meta: {
            description: null,
            name: '=1+1',
            tags: [
              'apimetrics:meta:domain:google.apimetrics.xyz',
              'apimetrics:meta:http:google_lb',
              'apimetrics:meta:ns_host:Google+LLC',
              'apimetrics:meta:server:gunicorn',
              'apimetrics:meta:host:Google+LLC',
            ],
          },
          request: {
            body: 'abc123',
            headers: [{key: 'Content-type', value: 'text/plain'}],
            method: 'GET',
            url: 'http://google.apimetrics.xyz/get',
          },
        })
        .reply(200, callsResponse);
    })
    .command(['calls:edit', '--json', '--call-id', '1234', '--body=abc123'])
    .it('Add body with existing content-type flag');

  auth
    .stdout()
    .nock('https://client.apimetrics.io', (api) => {
      api.get('/api/2/calls/1234/').reply(200, {
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
      });
      api
        .post('/api/2/calls/1234/', {
          meta: {
            description: null,
            name: '=1+1',
            tags: [
              'apimetrics:meta:domain:google.apimetrics.xyz',
              'apimetrics:meta:http:google_lb',
              'apimetrics:meta:ns_host:Google+LLC',
              'apimetrics:meta:server:gunicorn',
              'apimetrics:meta:host:Google+LLC',
            ],
          },
          request: {
            body: 'abc123',
            headers: [{key: 'Content-Type', value: 'application/json'}],
            method: 'GET',
            url: 'http://google.apimetrics.xyz/get',
          },
        })
        .reply(200, callsResponse);
    })
    .command(['calls:edit', '--json', '--call-id', '1234', '--body=abc123'])
    .it('Add body with no content-type flag');
});
