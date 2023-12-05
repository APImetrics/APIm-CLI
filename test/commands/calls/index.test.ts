/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const callsResponse = {
  meta: {},
  results: [
    {
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
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDAk53dhwoM',
      meta: {
        accept: 'application/json',
        content_type: null,
        created: '2021-01-28T01:19:09.072247Z',
        description: null,
        domain: 'google.apimetrics.xyz',
        last_update: '2022-07-19T22:38:51.402395Z',
        name: 'API Call 1/27/2021, 5:19:08 PM',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
        tags: [
          'apimetrics:meta:domain:google.apimetrics.xyz',
          'apimetrics:meta:ns_host:Google+LLC',
          'apimetrics:meta:host:Google+LLC',
        ],
        workspace: 'global',
      },
      request: {
        auth_id: null,
        body: null,
        headers: [
          {
            key: 'Accept',
            value: 'application/json',
          },
        ],
        method: 'GET',
        parameters: [],
        token_id: null,
        url: 'https://google.apimetrics.xyz/get',
      },
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDA1P-rxAgM',
      meta: {
        accept: 'application/json',
        content_type: 'application/json',
        created: '2020-02-14T22:18:57.798483Z',
        description: 'Auto-generated API Call',
        domain: 'google.apimetrics.xyz',
        last_update: '2022-07-19T22:38:49.258562Z',
        name: 'Example HTTP POST Call',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
        tags: [
          'sector:hobbyist',
          'apimetrics:meta:domain:google.apimetrics.xyz',
          'apimetrics:meta:ns_host:Google+LLC',
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
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDA1P-rhAkM',
      meta: {
        accept: 'application/json',
        content_type: 'application/json',
        created: '2020-02-14T22:14:17.544261Z',
        description: 'Auto-generated API Call',
        domain: 'google.apimetrics.xyz',
        last_update: '2022-07-19T22:38:50.568213Z',
        name: "a_project1_editor's API call",
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
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDAtKWRiAoM',
      meta: {
        accept: 'application/json',
        content_type: 'application/json',
        created: '2020-02-14T22:13:04.896102Z',
        description: 'Auto-generated API Call',
        domain: 'google.apimetrics.xyz',
        last_update: '2022-07-19T22:38:52.829696Z',
        name: "a_project_1_owner's API call",
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
    },
  ],
};

describe('calls', () => {
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
      api.get('/api/2/calls/').reply(200, callsResponse)
    )
    .stdout()
    .command(['calls', '--output=json'])
    .it('List calls with --output=json argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          description: '',
          method: 'GET',
          name: '=1+1',
          url: 'http://google.apimetrics.xyz/get',
        },
        {
          description: '',
          method: 'GET',
          name: 'API Call 1/27/2021, 5:19:08 PM',
          url: 'https://google.apimetrics.xyz/get',
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
          name: "a_project1_editor's API call",
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          description: 'Auto-generated API Call',
          method: 'POST',
          name: "a_project_1_owner's API call",
          url: 'http://google.apimetrics.xyz/post',
        },
      ]);
    });

  noProject
    .nock(
      'https://client.apimetrics.io',
      {reqheaders: {'Apimetrics-Project-Id': (val) => val === 'abc123'}},
      (api) => api.get('/api/2/calls/').reply(200, callsResponse)
    )
    .stdout()
    .command(['calls', '--output=json', '-p', 'abc123'])
    .it('Pass --project-id argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          description: '',
          method: 'GET',
          name: '=1+1',
          url: 'http://google.apimetrics.xyz/get',
        },
        {
          description: '',
          method: 'GET',
          name: 'API Call 1/27/2021, 5:19:08 PM',
          url: 'https://google.apimetrics.xyz/get',
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
          name: "a_project1_editor's API call",
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          description: 'Auto-generated API Call',
          method: 'POST',
          name: "a_project_1_owner's API call",
          url: 'http://google.apimetrics.xyz/post',
        },
      ]);
    });
});
