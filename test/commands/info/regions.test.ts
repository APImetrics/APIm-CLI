import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const regionsResponse = {
  meta: {},
  regions: [
    {
      id: 'sft',
      name: 'IBM Cloud',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
    },
    {
      id: 'eu',
      name: 'Europe',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
    },
    {
      id: 'azr',
      name: 'Microsoft Azure',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
    },
    {
      id: 'na',
      name: 'North America',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
    },
    {
      id: 'oc',
      name: 'Oceania',
      locations: ['public_qcazureasiase'],
    },
    {
      id: 'sa',
      name: 'South America',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
    },
    {
      id: 'aws',
      name: 'Amazon AWS',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
    },
    {
      id: 'all',
      name: 'Worldwide',
      locations: ['public_qcazureasiase', 'public_qcawsuswest', 'public_qcgoogleuscentral'],
    },
    {
      id: 'af',
      name: 'Africa',
      locations: ['public_azuresouthafricanorth'],
    },
    {
      id: 'ap',
      name: 'Asia-Pacfic',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
    },
    {
      id: 'goo',
      name: 'Google Cloud',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
    },
    {
      id: 'ww',
      name: null,
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
    },
  ],
};

describe('info regions', () => {
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
      api.get('/api/2/agents/info').reply(200, regionsResponse)
    )
    .stdout()
    .command(['info:regions', '--output=json'])
    .it('List all regions with --output=json argument', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal([
        {
          name: 'IBM Cloud',
          id: 'sft',
        },
        {
          name: 'Europe',
          id: 'eu',
        },
        {
          name: 'Microsoft Azure',
          id: 'azr',
        },
        {
          name: 'North America',
          id: 'na',
        },
        {
          name: 'Oceania',
          id: 'oc',
        },
        {
          name: 'South America',
          id: 'sa',
        },
        {
          name: 'Amazon AWS',
          id: 'aws',
        },
        {
          name: 'Worldwide',
          id: 'all',
        },
        {
          name: 'Africa',
          id: 'af',
        },
        {
          name: 'Asia-Pacfic',
          id: 'ap',
        },
        {
          name: 'Google Cloud',
          id: 'goo',
        },
        {
          name: 'null',
          id: 'ww',
        },
      ]);
    });
});
