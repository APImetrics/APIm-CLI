import {expect, test} from '@oclif/test';
import * as fs from 'fs-extra';
import * as path from 'node:path';

const accountProjects = {
  projects: [],
};

describe('config project set', () => {
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

  conf
    .stderr()
    .command(['config:project:set', '--json'])
    .catch((error) => {
      expect(error.message).to.contain(
        'Cannot use --json with interactive mode. Specify project using --project-id instead.'
      );
    })
    .it('Set project passing --json flag without --project-id', (ctx) => {
      const output = JSON.parse(ctx.stderr);
      expect(output).to.deep.contain({
        success: false,
        message:
          'Cannot use --json with interactive mode. Specify project using --project-id instead.',
      });
    });
  conf
    .stdout()
    .command(['config:project:set', '--project-id', 'abcdefg'])
    .it('Set project passing --project-id', (ctx) => {
      expect(ctx.stdout).to.equal('');
    });
  conf
    .stderr()
    .command(['config:project:set'])
    .catch((error) => {
      expect(error.message).to.contain('Please select an organization first');
    })
    .it('Interactive mode without setting the current working organization first');

  bearerAuth
    .nock('https://client.apimetrics.io', (api) =>
      api.get('/api/2/account/projects').reply(200, accountProjects)
    )
    .stderr()
    .command(['config:project:set'])
    .it('Set project with no projects in org', (ctx) => {
      expect(ctx.stderr).to.deep.contain(
        'No projects accessible in organization. Please create a project first.'
      );
    });
});
