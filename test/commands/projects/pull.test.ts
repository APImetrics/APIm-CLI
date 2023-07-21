/* eslint-disable camelcase */
import {test} from '@oclif/test';
import {expect} from 'chai';
import * as fs from 'fs-extra';

const yamlResponse = `
---
$schema: https://qc-client.apimetrics.io/api/2/import/schema.json
project:
  auth: []
  calls:
  - conditions: null
    id: call-api-call-17-06-2023-17-29-27
    meta:
      description: null
      name: API Call 17/06/2023, 17:29:27
      tags:
      - apimetrics:noredirect
      - apimetrics:timeout:60
    request:
      auth_id: null
      body: null
      headers:
      - key: Accept
        value: application/json
      method: GET
      parameters: []
      token_id: null
      url: https://google.apimetrics.xyz/get
    webhooks: []
  conditions: null
  environments:
    global: []
  files: []
  meta:
    name: API Project 17/06/2023
    tags: []
  reports: []
  schedules:
  - id: schedule-default-schedule
    meta:
      name: Default Schedule
      tags: []
    schedule:
      backoff_method: null
      frequency: 300
      locations: []
      regions:
      - all
      target_ids: []
  webhooks: []
  workflows: []
version: '2'
`;

const jsonResponse = {
  project: {
    files: [],
    calls: [
      {
        conditions: null,
        webhooks: [],
        meta: {
          description: null,
          tags: ['apimetrics:noredirect', 'apimetrics:timeout:60'],
          name: 'API Call 17/06/2023, 17:29:27',
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
        id: 'call-api-call-17-06-2023-17-29-27',
      },
    ],
    schedules: [
      {
        meta: {
          name: 'Default Schedule',
          tags: [],
        },
        id: 'schedule-default-schedule',
        schedule: {
          regions: ['all'],
          frequency: 300,
          locations: [],
          target_ids: [],
          backoff_method: null,
        },
      },
    ],
    auth: [],
    reports: [],
    meta: {
      name: 'API Project 17/06/2023',
      tags: [],
    },
    environments: {
      global: [],
    },
    workflows: [],
    webhooks: [],
    conditions: null,
  },
  $schema: 'https://qc-client.apimetrics.io/api/2/import/schema.json',
  version: '2',
};

describe('pull project.yaml', () => {
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

      if (fs.existsSync('./.test/project.yaml')) {
        fs.rmSync('./.test/project.yaml');
      }
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});

  const existingProjectYaml = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organisation: {current: 'abc123'},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'key',
      });

      if (fs.existsSync('./.test/project.yaml')) {
        fs.rmSync('./.test/project.yaml');
      }

      fs.writeFileSync('./.test/project.yaml', '');
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
    .nock('https://client.apimetrics.io', {reqheaders: {Accept: 'application/yaml'}}, (api) =>
      api
        .get('/api/2/export/?environment_values=true&header_values=true&webhooks=true')
        .reply(200, yamlResponse)
    )
    .stdout()
    .command(['projects:pull'])
    .it('Pull project.yaml');

  auth
    .nock('https://client.apimetrics.io', {reqheaders: {Accept: 'application/yaml'}}, (api) =>
      api
        .get('/api/2/export/?environment_values=true&header_values=true&webhooks=true')
        .reply(200, yamlResponse)
    )
    .stdout()
    .command(['projects:pull', '--out', '.test/project.yaml'])
    .it('Write project.yaml to disk');

  existingProjectYaml
    .nock('https://client.apimetrics.io', {reqheaders: {Accept: 'application/yaml'}}, (api) =>
      api
        .get('/api/2/export/?environment_values=true&header_values=true&webhooks=true')
        .reply(200, yamlResponse)
    )
    .stderr()
    .command(['projects:pull', '--out', '.test/project.yaml', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'File .test/project.yaml already exists. Use --force to overwrite it.'
      );
    })
    .it('Write project.yaml to disk with existing file error');

  existingProjectYaml
    .nock('https://client.apimetrics.io', {reqheaders: {Accept: 'application/yaml'}}, (api) =>
      api
        .get('/api/2/export/?environment_values=true&header_values=true&webhooks=true')
        .reply(200, yamlResponse)
    )
    .stdout()
    .command(['projects:pull', '--out', '.test/project.yaml', '--json', '--force'])
    .it('Write project.yaml to disk with existing file force');

  auth
    .nock('https://client.apimetrics.io', {reqheaders: {Accept: 'application/json'}}, (api) =>
      api
        .get('/api/2/export/?environment_values=true&header_values=true&webhooks=true')
        .reply(200, jsonResponse)
    )
    .stdout()
    .command(['projects:pull', '--json'])
    .it('Pull project.json');

  noProject
    .nock(
      'https://client.apimetrics.io',
      {
        reqheaders: {
          Accept: 'application/yaml',
          'Apimetrics-Project-Id': (val) => val === 'abc123',
        },
      },
      (api) =>
        api
          .get('/api/2/export/?environment_values=true&header_values=true&webhooks=true')
          .reply(200, yamlResponse)
    )
    .stdout()
    .command(['projects:pull', '-p', 'abc123'])
    .it('Pull project.yaml passing project ID');
});