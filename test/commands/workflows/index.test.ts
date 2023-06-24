/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const workflowsResponse = {
  meta: {},
  results: [
    {
      meta: {
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        name: 'Auth APIs',
        workspace: 'global',
        tags: ['importer:workflow-auth-apis'],
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        deployments: null,
        created: '2023-05-17T00:49:24.687845Z',
        last_update: '2023-05-24T22:45:24.188491Z',
        description: null,
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDg3tr7iQoM',
      workflow: {
        handle_cookies: false,
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg3tr7iQgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgvpGcxggM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgvpH6hQsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg3rq-jgsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg7pOi6AoM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgvoiC2QgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg_qaMtAsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
        ],
        stop_on_failure: false,
      },
    },
    {
      meta: {
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        name: 'Calls APIs',
        workspace: 'global',
        tags: ['importer:workflow-calls-apis'],
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        deployments: null,
        created: '2023-05-17T00:49:24.808317Z',
        last_update: '2023-05-31T19:16:09.481324Z',
        description: '',
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDg3vX4ggsM',
      workflow: {
        handle_cookies: false,
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgrtrv8AsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg3rb5mAsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg3rXamQsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
        ],
        stop_on_failure: false,
      },
    },
    {
      meta: {
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        name: 'Conditions List w/ schema checks',
        workspace: 'global',
        tags: ['importer:conditions-list-w-schema-checks'],
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        deployments: null,
        created: '2023-05-24T22:35:31.583670Z',
        last_update: '2023-06-08T21:59:54.631792Z',
        description: null,
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDgwaupmQkM',
      workflow: {
        handle_cookies: false,
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgvuqvhQsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
        ],
        stop_on_failure: false,
      },
    },
    {
      meta: {
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        name: 'Conditions List w/ schema checks',
        workspace: 'global',
        tags: ['importer:workflow-conditions-list-w-schema-checks'],
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        deployments: null,
        created: '2023-05-24T22:44:32.847014Z',
        last_update: '2023-05-24T22:45:24.132204Z',
        description: null,
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDgwbnaigsM',
      workflow: {
        handle_cookies: false,
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgvuqvhQsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
        ],
        stop_on_failure: false,
      },
    },
    {
      meta: {
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        name: 'Hooks APIs',
        workspace: 'global',
        tags: ['importer:workflow-hooks-apis'],
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        deployments: null,
        created: '2023-05-17T00:49:24.542873Z',
        last_update: '2023-05-24T22:45:24.035804Z',
        description: null,
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDg3rb52AgM',
      workflow: {
        handle_cookies: false,
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg3rSingkM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg3rb5mAkM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgnq-zmwsM',
        ],
        stop_on_failure: true,
      },
    },
    {
      meta: {
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        name: 'Incoming Hook Workflow',
        workspace: 'global',
        tags: ['importer:workflow-incoming-hook-workflow'],
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        deployments: null,
        created: '2023-05-17T00:49:24.638529Z',
        last_update: '2023-05-24T22:45:24.233786Z',
        description: null,
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDgvqOSmQoM',
      workflow: {
        handle_cookies: false,
        call_ids: ['ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg3rSingsM'],
        stop_on_failure: true,
      },
    },
    {
      meta: {
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        name: 'Open Data GZIP test',
        workspace: 'global',
        tags: ['checker', 'ASDASD'],
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        deployments: null,
        created: '2023-06-08T19:04:53.193993Z',
        last_update: '2023-06-08T22:54:03.159894Z',
        description: null,
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDgscOmnAsM',
      workflow: {
        handle_cookies: false,
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgscO_3wsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg_pi8mwsM',
        ],
        stop_on_failure: false,
      },
    },
    {
      meta: {
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        name: 'Reports APIs',
        workspace: 'global',
        tags: ['importer:workflow-reports-apis'],
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        deployments: null,
        created: '2023-05-17T00:49:24.501600Z',
        last_update: '2023-05-24T22:45:23.994877Z',
        description: null,
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDg3sv4zwgM',
      workflow: {
        handle_cookies: false,
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgvurlmwkM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgvpq4lAkM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
        ],
        stop_on_failure: false,
      },
    },
    {
      meta: {
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        name: 'Schedules APIs',
        workspace: 'global',
        tags: ['importer:workflow-schedules-apis'],
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        deployments: null,
        created: '2023-05-17T00:49:24.853718Z',
        last_update: '2023-06-08T21:59:44.754339Z',
        description: null,
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDg3rq-zggM',
      workflow: {
        handle_cookies: false,
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg3rXvnQsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgrtrviAgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
        ],
        stop_on_failure: false,
      },
    },
    {
      meta: {
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        name: 'Timestamp APIs',
        workspace: 'global',
        tags: ['importer:workflow-timestamp-apis'],
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        deployments: null,
        created: '2023-05-17T00:49:24.768693Z',
        last_update: '2023-05-24T22:45:24.082121Z',
        description: null,
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDggfOs4QgM',
      workflow: {
        handle_cookies: false,
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg_q7jhwkM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDggbOZ2ggM',
        ],
        stop_on_failure: true,
      },
    },
    {
      meta: {
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        name: 'Workflows APIs',
        workspace: 'global',
        tags: ['importer:workflow-workflows-apis'],
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        deployments: null,
        created: '2023-05-17T00:49:24.592675Z',
        last_update: '2023-06-21T18:35:42.984786Z',
        description: null,
      },
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDgvurzmAsM',
      workflow: {
        handle_cookies: false,
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg7pOi6AgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgvpGchgsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
        ],
        stop_on_failure: false,
      },
    },
  ],
};

describe('list workflows', () => {
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
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/workflows/').reply(200, workflowsResponse)
    )
    .stdout()
    .command(['workflows', '--output=json'])
    .it('Standard columns in JSON', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          name: 'Auth APIs',
          description: 'null',
          stopOnFailure: 'false',
          handleCookies: 'false',
        },
        {
          name: 'Calls APIs',
          description: '',
          stopOnFailure: 'false',
          handleCookies: 'false',
        },
        {
          name: 'Conditions List w/ schema checks',
          description: 'null',
          stopOnFailure: 'false',
          handleCookies: 'false',
        },
        {
          name: 'Conditions List w/ schema checks',
          description: 'null',
          stopOnFailure: 'false',
          handleCookies: 'false',
        },
        {
          name: 'Hooks APIs',
          description: 'null',
          stopOnFailure: 'true',
          handleCookies: 'false',
        },
        {
          name: 'Incoming Hook Workflow',
          description: 'null',
          stopOnFailure: 'true',
          handleCookies: 'false',
        },
        {
          name: 'Open Data GZIP test',
          description: 'null',
          stopOnFailure: 'false',
          handleCookies: 'false',
        },
        {
          name: 'Reports APIs',
          description: 'null',
          stopOnFailure: 'false',
          handleCookies: 'false',
        },
        {
          name: 'Schedules APIs',
          description: 'null',
          stopOnFailure: 'false',
          handleCookies: 'false',
        },
        {
          name: 'Timestamp APIs',
          description: 'null',
          stopOnFailure: 'true',
          handleCookies: 'false',
        },
        {
          name: 'Workflows APIs',
          description: 'null',
          stopOnFailure: 'false',
          handleCookies: 'false',
        },
      ]);
    });
});
