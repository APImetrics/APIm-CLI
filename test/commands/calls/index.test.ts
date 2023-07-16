/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const callsResponse = {
  meta: {},
  results: [
    {
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
    },
    {
      meta: {
        domain: 'google.apimetrics.xyz',
        description: null,
        tags: [
          'apimetrics:meta:domain:google.apimetrics.xyz',
          'apimetrics:meta:ns_host:Google+LLC',
          'apimetrics:meta:host:Google+LLC',
        ],
        accept: 'application/json',
        content_type: null,
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
        name: 'API Call 1/27/2021, 5:19:08 PM',
        created: '2021-01-28T01:19:09.072247Z',
        last_update: '2022-07-19T22:38:51.402395Z',
        workspace: 'global',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
      },
      request: {
        body: null,
        parameters: [],
        url: 'https://google.apimetrics.xyz/get',
        auth_id: null,
        headers: [
          {
            value: 'application/json',
            key: 'Accept',
          },
        ],
        token_id: null,
        method: 'GET',
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDAk53dhwoM',
    },
    {
      meta: {
        domain: 'google.apimetrics.xyz',
        description: 'Auto-generated API Call',
        tags: [
          'sector:hobbyist',
          'apimetrics:meta:domain:google.apimetrics.xyz',
          'apimetrics:meta:ns_host:Google+LLC',
          'api_type:update',
          'apimetrics:meta:host:Google+LLC',
        ],
        accept: 'application/json',
        content_type: 'application/json',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
        name: 'Example HTTP POST Call',
        created: '2020-02-14T22:18:57.798483Z',
        last_update: '2022-07-19T22:38:49.258562Z',
        workspace: 'global',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
      },
      request: {
        body: '{"success": "Congratulations, this is your first APImetrics API Call!"}',
        parameters: [],
        url: 'http://google.apimetrics.xyz/post',
        auth_id: null,
        headers: [
          {
            value: 'application/json',
            key: 'Accept',
          },
          {
            value: 'application/json',
            key: 'Content-Type',
          },
        ],
        token_id: null,
        method: 'POST',
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDA1P-rxAgM',
    },
    {
      meta: {
        domain: 'google.apimetrics.xyz',
        description: 'Auto-generated API Call',
        tags: [
          'sector:hobbyist',
          'apimetrics:meta:domain:google.apimetrics.xyz',
          'apimetrics:meta:http:google_lb',
          'apimetrics:meta:ns_host:Google+LLC',
          'apimetrics:meta:server:gunicorn',
          'api_type:update',
          'apimetrics:meta:host:Google+LLC',
        ],
        accept: 'application/json',
        content_type: 'application/json',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
        name: "a_project1_editor's API call",
        created: '2020-02-14T22:14:17.544261Z',
        last_update: '2022-07-19T22:38:50.568213Z',
        workspace: 'global',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
      },
      request: {
        body: '{"success": "Congratulations, this is your first APImetrics API Call!"}',
        parameters: [],
        url: 'http://google.apimetrics.xyz/post',
        auth_id: null,
        headers: [
          {
            value: 'application/json',
            key: 'Accept',
          },
          {
            value: 'application/json',
            key: 'Content-Type',
          },
        ],
        token_id: null,
        method: 'POST',
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDA1P-rhAkM',
    },
    {
      meta: {
        domain: 'google.apimetrics.xyz',
        description: 'Auto-generated API Call',
        tags: [
          'sector:hobbyist',
          'apimetrics:meta:domain:google.apimetrics.xyz',
          'apimetrics:meta:http:google_lb',
          'apimetrics:meta:ns_host:Google+LLC',
          'apimetrics:meta:server:gunicorn',
          'api_type:update',
          'apimetrics:meta:host:Google+LLC',
        ],
        accept: 'application/json',
        content_type: 'application/json',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
        name: "a_project_1_owner's API call",
        created: '2020-02-14T22:13:04.896102Z',
        last_update: '2022-07-19T22:38:52.829696Z',
        workspace: 'global',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDA1PLekQoM',
      },
      request: {
        body: '{"success": "Congratulations, this is your first APImetrics API Call!"}',
        parameters: [],
        url: 'http://google.apimetrics.xyz/post',
        auth_id: null,
        headers: [
          {
            value: 'application/json',
            key: 'Accept',
          },
          {
            value: 'application/json',
            key: 'Content-Type',
          },
        ],
        token_id: null,
        method: 'POST',
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDAtKWRiAoM',
    },
  ],
};

describe('list calls', () => {
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

  const noProject = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organisation: {current: 'abc123'},
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
      api.get('/api/2/calls/').reply(200, callsResponse)
    )
    .stdout()
    .command(['calls', '--output=json'])
    .it('Standard columns in JSON', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          name: '=1+1',
          description: 'null',
          method: 'GET',
          url: 'http://google.apimetrics.xyz/get',
        },
        {
          name: 'API Call 1/27/2021, 5:19:08 PM',
          description: 'null',
          method: 'GET',
          url: 'https://google.apimetrics.xyz/get',
        },
        {
          name: 'Example HTTP POST Call',
          description: 'Auto-generated API Call',
          method: 'POST',
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          name: "a_project1_editor's API call",
          description: 'Auto-generated API Call',
          method: 'POST',
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          name: "a_project_1_owner's API call",
          description: 'Auto-generated API Call',
          method: 'POST',
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
    .it('Standard columns in JSON passing project ID', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          name: '=1+1',
          description: 'null',
          method: 'GET',
          url: 'http://google.apimetrics.xyz/get',
        },
        {
          name: 'API Call 1/27/2021, 5:19:08 PM',
          description: 'null',
          method: 'GET',
          url: 'https://google.apimetrics.xyz/get',
        },
        {
          name: 'Example HTTP POST Call',
          description: 'Auto-generated API Call',
          method: 'POST',
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          name: "a_project1_editor's API call",
          description: 'Auto-generated API Call',
          method: 'POST',
          url: 'http://google.apimetrics.xyz/post',
        },
        {
          name: "a_project_1_owner's API call",
          description: 'Auto-generated API Call',
          method: 'POST',
          url: 'http://google.apimetrics.xyz/post',
        },
      ]);
    });
});
