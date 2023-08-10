import {expect, test} from '@oclif/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('auth logout', () => {
  const auth = test
    .do(() => {
      fs.readdir('./.test', (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(path.join('./.test', file), (err) => {
            if (err) throw err;
          });
        }
      });
    })
    .env({APIMETRICS_CONFIG_DIR: './.test'});
  auth
    .stdout()
    .command(['auth:logout'])
    .it('Log out', (ctx) => {
      expect(ctx.stdout).to.contain('Logged out');
    });
});
