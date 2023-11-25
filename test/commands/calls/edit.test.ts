/* eslint-disable camelcase */
import {test} from '@oclif/test';
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
    body: null,
  },
};

describe('calls edit', () => {
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
              value: 'text/plain',
            },
          ],
          token_id: null,
          method: 'GET',
        },
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDA05v5mwoM',
      });
      api
        .post('/api/2/calls/1234/', {
          meta: {
            name: '=1+1',
            description: null,
            tags: [
              'apimetrics:meta:domain:google.apimetrics.xyz',
              'apimetrics:meta:http:google_lb',
              'apimetrics:meta:ns_host:Google+LLC',
              'apimetrics:meta:server:gunicorn',
              'apimetrics:meta:host:Google+LLC',
            ],
          },
          request: {
            method: 'GET',
            url: 'http://google.apimetrics.xyz/get',
            headers: [{key: 'Content-type', value: 'text/plain'}],
            body: 'abc123',
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
      });
      api
        .post('/api/2/calls/1234/', {
          meta: {
            name: '=1+1',
            description: null,
            tags: [
              'apimetrics:meta:domain:google.apimetrics.xyz',
              'apimetrics:meta:http:google_lb',
              'apimetrics:meta:ns_host:Google+LLC',
              'apimetrics:meta:server:gunicorn',
              'apimetrics:meta:host:Google+LLC',
            ],
          },
          request: {
            method: 'GET',
            url: 'http://google.apimetrics.xyz/get',
            headers: [{key: 'Content-Type', value: 'application/json'}],
            body: 'abc123',
          },
        })
        .reply(200, callsResponse);
    })
    .command(['calls:edit', '--json', '--call-id', '1234', '--body=abc123'])
    .it('Add body with no content-type flag');
});
