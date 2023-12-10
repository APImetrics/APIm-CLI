/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const locationsResponse = {
  agent_list: [
    {
      agent: {
        city: 'boardman',
        cloud: 'AWS',
        cloud_full_name: 'Amazon Web Services',
        continent: 'NA',
        country: 'US',
        geography: 'WEST',
        location: [36.974_991_2, -122.026_692_1],
        name: 'QC Oregon',
        normalized_name: 'AWS QC Oregon [United States, North America]',
        region: 'or',
      },
      id: 'public_qcawsuswest',
      meta: {
        created: '2015-10-28T22:50:05.591690Z',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyGAsSC1JlbW90ZUFnZW50GICAgMD5_9IJDA',
        last_update: '2023-06-23T23:49:53.855002Z',
        name: 'public_qcawsuswest',
        remote_addr: '54.191.239.225',
      },
    },
    {
      agent: {
        city: 'Singapore',
        cloud: 'Azure',
        cloud_full_name: 'Microsoft Azure',
        continent: 'AS',
        country: 'SG',
        geography: null,
        location: [1.389_198_2, 103.762_642_5],
        name: 'QC Singapore With a Really Really Really Really Really Really Really Really Really Really Long Name',
        normalized_name:
          'Azure QC Singapore With a Really Really Really Really Really Really Really Really Really Really Long Name [Singapore, Asia]',
        region: '?',
      },
      id: 'public_qcazureasiase',
      meta: {
        created: '2016-05-05T23:36:10.724410Z',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSC1JlbW90ZUFnZW50GOHguhYM',
        last_update: '2023-05-23T11:08:34.061888Z',
        name: 'public_qcazureasiase',
        remote_addr: '13.67.53.204',
      },
    },
    {
      agent: {
        city: '?',
        cloud: 'Google',
        cloud_full_name: 'Google Compute Engine',
        continent: 'NA',
        country: 'US',
        geography: 'CENTRAL',
        location: [41.220_900_8, -95.864_194_9],
        name: 'QC US Central',
        normalized_name: 'Google QC US Central [United States, North America]',
        region: '?',
      },
      id: 'public_qcgoogleuscentral',
      meta: {
        created: '2017-03-01T01:43:52.585870Z',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyGAsSC1JlbW90ZUFnZW50GICAgIqjgYMKDA',
        last_update: '2023-06-19T23:43:59.999405Z',
        name: 'public_qcgoogleuscentral',
        remote_addr: '35.226.77.27',
      },
    },
    {
      agent: {
        city: 'seattle',
        cloud: null,
        cloud_full_name: null,
        continent: 'NA',
        country: 'US',
        geography: null,
        location: null,
        name: 'Demo Agent',
        normalized_name: 'Demo Agent [United States, North America]',
        region: 'wa',
      },
      id: 'qcmetrics_demoagent',
      meta: {
        created: '2022-01-20T02:32:17.516992Z',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyGAsSC1JlbW90ZUFnZW50GICAoLaZnoQKDA',
        last_update: '2023-08-02T18:52:37.417659Z',
        name: 'qcmetrics_demoagent',
        remote_addr: '97.126.85.189',
      },
    },
  ],
  meta: {},
};

describe('info locations', () => {
  const bearerAuth = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: 'abc123'},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        mode: 'bearer',
        token: 'abc123',
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'})
    .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/agents/info').reply(200, locationsResponse)
    )
    .stdout()
    .command(['info:locations', '--output=json'])
    .it('List all locations with --output=json argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          ip: '54.191.239.225',
          name: 'public_qcawsuswest',
        },
        {
          ip: '13.67.53.204',
          name: 'public_qcazureasiase',
        },
        {
          ip: '35.226.77.27',
          name: 'public_qcgoogleuscentral',
        },
        {
          ip: '97.126.85.189',
          name: 'qcmetrics_demoagent',
        },
      ]);
    });
});
