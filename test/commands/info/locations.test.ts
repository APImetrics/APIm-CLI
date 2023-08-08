/* eslint-disable camelcase */
import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const locationsResponse = {
  meta: {},
  agent_list: [
    {
      meta: {
        last_update: '2023-06-23T23:49:53.855002Z',
        created: '2015-10-28T22:50:05.591690Z',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyGAsSC1JlbW90ZUFnZW50GICAgMD5_9IJDA',
        remote_addr: '54.191.239.225',
        name: 'public_qcawsuswest',
      },
      id: 'public_qcawsuswest',
      agent: {
        city: 'boardman',
        name: 'QC Oregon',
        location: [36.974_991_2, -122.026_692_1],
        normalized_name: 'AWS QC Oregon [United States, North America]',
        country: 'US',
        cloud_full_name: 'Amazon Web Services',
        region: 'or',
        continent: 'NA',
        cloud: 'AWS',
        geography: 'WEST',
      },
    },
    {
      meta: {
        last_update: '2023-05-23T11:08:34.061888Z',
        created: '2016-05-05T23:36:10.724410Z',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyFAsSC1JlbW90ZUFnZW50GOHguhYM',
        remote_addr: '13.67.53.204',
        name: 'public_qcazureasiase',
      },
      id: 'public_qcazureasiase',
      agent: {
        city: 'Singapore',
        name: 'QC Singapore With a Really Really Really Really Really Really Really Really Really Really Long Name',
        location: [1.389_198_2, 103.762_642_5],
        normalized_name:
          'Azure QC Singapore With a Really Really Really Really Really Really Really Really Really Really Long Name [Singapore, Asia]',
        country: 'SG',
        cloud_full_name: 'Microsoft Azure',
        region: '?',
        continent: 'AS',
        cloud: 'Azure',
        geography: null,
      },
    },
    {
      meta: {
        last_update: '2023-06-19T23:43:59.999405Z',
        created: '2017-03-01T01:43:52.585870Z',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyGAsSC1JlbW90ZUFnZW50GICAgIqjgYMKDA',
        remote_addr: '35.226.77.27',
        name: 'public_qcgoogleuscentral',
      },
      id: 'public_qcgoogleuscentral',
      agent: {
        city: '?',
        name: 'QC US Central',
        location: [41.220_900_8, -95.864_194_9],
        normalized_name: 'Google QC US Central [United States, North America]',
        country: 'US',
        cloud_full_name: 'Google Compute Engine',
        region: '?',
        continent: 'NA',
        cloud: 'Google',
        geography: 'CENTRAL',
      },
    },
    {
      meta: {
        last_update: '2023-08-02T18:52:37.417659Z',
        created: '2022-01-20T02:32:17.516992Z',
        id: 'ag9zfmFwaW1ldHJpY3MtcWNyGAsSC1JlbW90ZUFnZW50GICAoLaZnoQKDA',
        remote_addr: '97.126.85.189',
        name: 'qcmetrics_demoagent',
      },
      id: 'qcmetrics_demoagent',
      agent: {
        city: 'seattle',
        name: 'Demo Agent',
        location: null,
        normalized_name: 'Demo Agent [United States, North America]',
        country: 'US',
        cloud_full_name: null,
        region: 'wa',
        continent: 'NA',
        cloud: null,
        geography: null,
      },
    },
  ],
};

describe('list locations', () => {
  const bearerAuth = test
    .do(() => {
      fs.writeJsonSync('./.test/config.json', {
        organization: {current: 'abc123'},
        project: {current: 'abc123'},
      });
      fs.writeJsonSync('./.test/auth.json', {
        token: 'abc123',
        mode: 'bearer',
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
    .it('Standard columns in JSON', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          name: 'public_qcawsuswest',
          ip: '54.191.239.225',
        },
        {
          name: 'public_qcazureasiase',
          ip: '13.67.53.204',
        },
        {
          name: 'public_qcgoogleuscentral',
          ip: '35.226.77.27',
        },
        {
          name: 'qcmetrics_demoagent',
          ip: '97.126.85.189',
        },
      ]);
    });
});
