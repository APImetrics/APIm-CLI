/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const workflowsResponse = {
  meta: {},
  results: [
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDg3tr7iQoM',
      meta: {
        created: '2023-05-17T00:49:24.687845Z',
        deployments: null,
        description: null,
        last_update: '2023-05-24T22:45:24.188491Z',
        name: 'Auth APIs',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['importer:workflow-auth-apis'],
        workspace: 'global',
      },
      workflow: {
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
        handle_cookies: false,
        stop_on_failure: false,
      },
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDg3vX4ggsM',
      meta: {
        created: '2023-05-17T00:49:24.808317Z',
        deployments: null,
        description: '',
        last_update: '2023-05-31T19:16:09.481324Z',
        name: 'Calls APIs',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['importer:workflow-calls-apis'],
        workspace: 'global',
      },
      workflow: {
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgrtrv8AsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg3rb5mAsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg3rXamQsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
        ],
        handle_cookies: false,
        stop_on_failure: false,
      },
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDgwaupmQkM',
      meta: {
        created: '2023-05-24T22:35:31.583670Z',
        deployments: null,
        description: null,
        last_update: '2023-06-08T21:59:54.631792Z',
        name: 'Conditions List w/ schema checks',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['importer:conditions-list-w-schema-checks'],
        workspace: 'global',
      },
      workflow: {
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgvuqvhQsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
        ],
        handle_cookies: false,
        stop_on_failure: false,
      },
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDgwbnaigsM',
      meta: {
        created: '2023-05-24T22:44:32.847014Z',
        deployments: null,
        description: null,
        last_update: '2023-05-24T22:45:24.132204Z',
        name: 'Conditions List w/ schema checks',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['importer:workflow-conditions-list-w-schema-checks'],
        workspace: 'global',
      },
      workflow: {
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgvuqvhQsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
        ],
        handle_cookies: false,
        stop_on_failure: false,
      },
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDg3rb52AgM',
      meta: {
        created: '2023-05-17T00:49:24.542873Z',
        deployments: null,
        description: null,
        last_update: '2023-05-24T22:45:24.035804Z',
        name: 'Hooks APIs',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['importer:workflow-hooks-apis'],
        workspace: 'global',
      },
      workflow: {
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg3rSingkM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg3rb5mAkM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgnq-zmwsM',
        ],
        handle_cookies: false,
        stop_on_failure: true,
      },
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDgvqOSmQoM',
      meta: {
        created: '2023-05-17T00:49:24.638529Z',
        deployments: null,
        description: null,
        last_update: '2023-05-24T22:45:24.233786Z',
        name: 'Incoming Hook Workflow',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['importer:workflow-incoming-hook-workflow'],
        workspace: 'global',
      },
      workflow: {
        call_ids: ['ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg3rSingsM'],
        handle_cookies: false,
        stop_on_failure: true,
      },
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDgscOmnAsM',
      meta: {
        created: '2023-06-08T19:04:53.193993Z',
        deployments: null,
        description: null,
        last_update: '2023-06-08T22:54:03.159894Z',
        name: 'Open Data GZIP test',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['checker', 'ASDASD'],
        workspace: 'global',
      },
      workflow: {
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgscO_3wsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg_pi8mwsM',
        ],
        handle_cookies: false,
        stop_on_failure: false,
      },
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDg3sv4zwgM',
      meta: {
        created: '2023-05-17T00:49:24.501600Z',
        deployments: null,
        description: null,
        last_update: '2023-05-24T22:45:23.994877Z',
        name: 'Reports APIs',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['importer:workflow-reports-apis'],
        workspace: 'global',
      },
      workflow: {
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgvurlmwkM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgvpq4lAkM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
        ],
        handle_cookies: false,
        stop_on_failure: false,
      },
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDg3rq-zggM',
      meta: {
        created: '2023-05-17T00:49:24.853718Z',
        deployments: null,
        description: null,
        last_update: '2023-06-08T21:59:44.754339Z',
        name: 'Schedules APIs',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['importer:workflow-schedules-apis'],
        workspace: 'global',
      },
      workflow: {
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg3rXvnQsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgrtrviAgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
        ],
        handle_cookies: false,
        stop_on_failure: false,
      },
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDggfOs4QgM',
      meta: {
        created: '2023-05-17T00:49:24.768693Z',
        deployments: null,
        description: null,
        last_update: '2023-05-24T22:45:24.082121Z',
        name: 'Timestamp APIs',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['importer:workflow-timestamp-apis'],
        workspace: 'global',
      },
      workflow: {
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg_q7jhwkM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDggbOZ2ggM',
        ],
        handle_cookies: false,
        stop_on_failure: true,
      },
    },
    {
      id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSB1Rlc3RSdW4YgIDgvurzmAsM',
      meta: {
        created: '2023-05-17T00:49:24.592675Z',
        deployments: null,
        description: null,
        last_update: '2023-06-21T18:35:42.984786Z',
        name: 'Workflows APIs',
        owner: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        project_id: 'ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDg3sv4jwkM',
        tags: ['importer:workflow-workflows-apis'],
        workspace: 'global',
      },
      workflow: {
        call_ids: [
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg7pOi6AgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgvpGchgsM',
          'ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDgoYHTwwgM',
        ],
        handle_cookies: false,
        stop_on_failure: false,
      },
    },
  ],
};

describe('workflows', () => {
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
      api.get('/api/2/workflows/').reply(200, workflowsResponse)
    )
    .stdout()
    .command(['workflows', '--output=json'])
    .it('List all workflows with --output=json argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          description: '',
          handleCookies: 'false',
          name: 'Auth APIs',
          stopOnFailure: 'false',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Calls APIs',
          stopOnFailure: 'false',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Conditions List w/ schema checks',
          stopOnFailure: 'false',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Conditions List w/ schema checks',
          stopOnFailure: 'false',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Hooks APIs',
          stopOnFailure: 'true',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Incoming Hook Workflow',
          stopOnFailure: 'true',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Open Data GZIP test',
          stopOnFailure: 'false',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Reports APIs',
          stopOnFailure: 'false',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Schedules APIs',
          stopOnFailure: 'false',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Timestamp APIs',
          stopOnFailure: 'true',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Workflows APIs',
          stopOnFailure: 'false',
        },
      ]);
    });

  noProject
    .nock(
      'https://client.apimetrics.io',
      {reqheaders: {'Apimetrics-Project-Id': (val) => val === 'abc123'}},
      (api) => api.get('/api/2/workflows/').reply(200, workflowsResponse)
    )
    .stdout()
    .command(['workflows', '--output=json', '-p', 'abc123'])
    .it('Pass --project-id argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          description: '',
          handleCookies: 'false',
          name: 'Auth APIs',
          stopOnFailure: 'false',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Calls APIs',
          stopOnFailure: 'false',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Conditions List w/ schema checks',
          stopOnFailure: 'false',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Conditions List w/ schema checks',
          stopOnFailure: 'false',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Hooks APIs',
          stopOnFailure: 'true',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Incoming Hook Workflow',
          stopOnFailure: 'true',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Open Data GZIP test',
          stopOnFailure: 'false',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Reports APIs',
          stopOnFailure: 'false',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Schedules APIs',
          stopOnFailure: 'false',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Timestamp APIs',
          stopOnFailure: 'true',
        },
        {
          description: '',
          handleCookies: 'false',
          name: 'Workflows APIs',
          stopOnFailure: 'false',
        },
      ]);
    });
});
