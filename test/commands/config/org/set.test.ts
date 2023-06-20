import {expect, test} from '@oclif/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('set current working org', () => {
  const conf = test
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

  conf
    .stderr()
    .command(['config:org:set', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Cannot use --json with interactive mode. Specify organisation using --org-id instead.'
      );
    })
    .it('Set org with --json');
  conf
    .stdout()
    .command(['config:org:set', '--org-id', 'abcdefg'])
    .it('Set project directly', (ctx) => {
      expect(ctx.stdout).to.equal('');
    });
});
