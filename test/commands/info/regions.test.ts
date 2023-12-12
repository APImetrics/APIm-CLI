import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';

const regionsResponse = {
  meta: {},
  regions: [
    {
      id: 'sft',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
      name: 'IBM Cloud',
    },
    {
      id: 'eu',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
      name: 'Europe',
    },
    {
      id: 'azr',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
      name: 'Microsoft Azure',
    },
    {
      id: 'na',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
      name: 'North America',
    },
    {
      id: 'oc',
      locations: ['public_qcazureasiase'],
      name: 'Oceania',
    },
    {
      id: 'sa',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
      name: 'South America',
    },
    {
      id: 'aws',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
      name: 'Amazon AWS',
    },
    {
      id: 'all',
      locations: ['public_qcazureasiase', 'public_qcawsuswest', 'public_qcgoogleuscentral'],
      name: 'Worldwide',
    },
    {
      id: 'af',
      locations: ['public_azuresouthafricanorth'],
      name: 'Africa',
    },
    {
      id: 'ap',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
      name: 'Asia-Pacfic',
    },
    {
      id: 'goo',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
      name: 'Google Cloud',
    },
    {
      id: 'ww',
      locations: ['public_qcazureasiase', 'public_qcawsuswest'],
      name: null,
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
        mode: 'bearer',
        token: 'abc123',
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
          id: 'sft',
          name: 'IBM Cloud',
        },
        {
          id: 'eu',
          name: 'Europe',
        },
        {
          id: 'azr',
          name: 'Microsoft Azure',
        },
        {
          id: 'na',
          name: 'North America',
        },
        {
          id: 'oc',
          name: 'Oceania',
        },
        {
          id: 'sa',
          name: 'South America',
        },
        {
          id: 'aws',
          name: 'Amazon AWS',
        },
        {
          id: 'all',
          name: 'Worldwide',
        },
        {
          id: 'af',
          name: 'Africa',
        },
        {
          id: 'ap',
          name: 'Asia-Pacfic',
        },
        {
          id: 'goo',
          name: 'Google Cloud',
        },
        {
          id: 'ww',
          name: 'null',
        },
      ]);
    });
});
