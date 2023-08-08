import {expect, test} from '@oclif/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('device flow authentication', () => {
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
    .stderr()
    .command(['login', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Cannot use --json with device flow authentication. Use --key instead.'
      );
    })
    .it('Device flow with --json', (ctx) => {
      const output = JSON.parse(ctx.stderr);
      expect(output).to.deep.contain({
        success: false,
        message: 'Cannot use --json with device flow authentication. Use --key instead.',
      });
    });
  auth
    .stdout()
    .command(['auth:logout'])
    .it('Log out', (ctx) => {
      expect(ctx.stdout).to.contain('Logged out');
    });
});
