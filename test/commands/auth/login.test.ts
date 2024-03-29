import {expect, test} from '@oclif/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('auth login', () => {
  const auth = test
    .do(() => {
      if (!fs.existsSync('./.test')) {
        fs.mkdirSync('./.test');
      }

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

  // The first test is always really slow because all TS files need to
  // be transpiled first. To get more meaningful times for other tests,
  // run this placeholder first.
  auth
    .stdout()
    .command('help')
    .it('Not a real test case. Transpile typescript files, expect to be slow');

  auth
    .stdout()
    .command(['login', '--key', 'lQjGo9CKKyD0gX7xQJMHY4Z104XmXoGs'])
    .it('API key login', (ctx) => {
      expect(ctx.stdout).to.contain('Logged in using API key');
    });
  auth
    .stdout()
    .command(['login', '--key', 'lQjGo9CKKyD0gX7xQJMHY4Z104XmXoGs', '--json'])
    .it('API key login (--json)', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        message: 'Logged in using API key',
        success: true,
      });
    });
  auth
    .stderr()
    .command(['login', '--key', 'lQjGo9CKKyD0gX7xQJMHY4Z104XmXoG', '--json'])
    .catch((error) => {
      expect(error.message).to.contain('API key is malformed. Expected 32 characters, got 31');
    })
    .it('API key login with --key of length 31 (want 32) (--json)', (ctx) => {
      const output = JSON.parse(ctx.stderr);
      expect(output).to.deep.contain({
        message: 'API key is malformed. Expected 32 characters, got 31',
        success: false,
      });
    });
  auth
    .stderr()
    .command(['login', '--key', 'lQjGo9CKKyD0gX7xQJMHY4Z104XmXoGs0'])
    .catch((error) => {
      expect(error.message).to.contain('API key is malformed. Expected 32 characters, got 33');
    })
    .it('API key login with --key of length 33 (want 32)');
  auth
    .stderr()
    .command(['login', '--key'])
    .catch((error) => {
      expect(error.message).to.contain('Flag --key expects a value');
    })
    .it('API key login passing empty --key argument');
  auth
    .stderr()
    .command(['login', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Cannot use --json with device flow authentication. Use --key instead.'
      );
    })
    .it('Device flow authentication passing --json flag', (ctx) => {
      const output = JSON.parse(ctx.stderr);
      expect(output).to.deep.contain({
        message: 'Cannot use --json with device flow authentication. Use --key instead.',
        success: false,
      });
    });
});
