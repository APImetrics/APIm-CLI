import fs from 'node:fs';
import fse from 'fs-extra';
import {test} from '@oclif/test';

export const auth = test
  .do(() => {
    fse.writeJsonSync('./.test/config.json', {
      organization: {current: 'abc123'},
      project: {current: 'abc123'},
    });
    fse.writeJsonSync('./.test/auth.json', {
      token: 'abc123',
      mode: 'key',
    });
  })
  .env({APIMETRICS_CONFIG_DIR: './.test'})
  .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});

export const noProject = test
  .do(() => {
    fse.writeJsonSync('./.test/config.json', {
      organization: {current: 'abc123'},
      project: {},
    });
    fse.writeJsonSync('./.test/auth.json', {
      token: 'abc123',
      mode: 'key',
    });
  })
  .env({APIMETRICS_CONFIG_DIR: './.test'})
  .env({APIMETRICS_API_URL: 'https://client.apimetrics.io/api/2/'});
