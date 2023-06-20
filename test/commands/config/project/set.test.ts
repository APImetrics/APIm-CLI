import {expect, test} from '@oclif/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('set current working project', () => {
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
    .command(['config:project:set', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Cannot use --json with interactive mode. Specify project using --project-id instead.'
      );
    })
    .it('Set project with --json', (ctx) => {
      const output = JSON.parse(ctx.stderr);
      expect(output).to.deep.equal({
        success: false,
        message:
          'Cannot use --json with interactive mode. Specify project using --project-id instead.',
      });
    });
  conf
    .stdout()
    .command(['config:project:set', '--project-id', 'abcdefg'])
    .it('Set project directly', (ctx) => {
      expect(ctx.stdout).to.equal('');
    });
  conf
    .stderr()
    .command(['config:project:set'])
    .catch((error) => {
      expect(error.message).to.contain('Please select an organization first');
    })
    .it('Interactive mode without org set');
});
