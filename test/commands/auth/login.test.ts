import {expect, test} from '@oclif/test';

describe('auth', () => {
  /*********
   * Login *
   *********/
  test
    .stdout()
    .command(['login', '--key', 'lQjGo9CKKyD0gX7xQJMHY4Z104XmXoGs'])
    .it('API key login', (ctx) => {
      expect(ctx.stdout).to.contain('Logged in using API key');
    });
  test
    .stdout()
    .command(['login', '--key', 'lQjGo9CKKyD0gX7xQJMHY4Z104XmXoGs', '--json'])
    .it('API key login --json', (ctx) => {
      const output = JSON.parse(ctx.stdout);
      expect(output).to.deep.equal({
        success: true,
        message: 'Logged in using API key',
      });
    });
  test
    .stderr()
    .command(['login', '--key', 'lQjGo9CKKyD0gX7xQJMHY4Z104XmXoG', '--json'])
    .catch((error) => {
      const output = JSON.parse(error.message);
      expect(output).to.deep.equal({
        success: false,
        message: 'API key is malformed. Expected 32 characters, got 31',
      });
    })
    .it('API key login with key too short --json');
  test
    .stderr()
    .command(['login', '--key', 'lQjGo9CKKyD0gX7xQJMHY4Z104XmXoGs0'])
    .catch((error) => {
      expect(error.message).to.contain('API key is malformed. Expected 32 characters, got 33');
    })
    .it('API key login with key too long');
  test
    .stderr()
    .command(['login', '--key', ''])
    .catch((error) => {
      expect(error.message).to.contain('No key specified');
    })
    .it('API key login no key');
});
