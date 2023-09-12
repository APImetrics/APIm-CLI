import {expect, test} from '@oclif/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('config org set', () => {
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
        'Cannot use --json with interactive mode. Specify organization using --org-id instead.'
      );
    })
    .it('Use --json argument without passing --org-id');
  conf
    .stdout()
    .command(['config:org:set', '--org-id', 'abcdefg'])
    .it('Set org passing --org-id argument', (ctx) => {
      expect(ctx.stdout).to.equal('');
    });
});
