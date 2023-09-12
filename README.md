APImetrics CLI
==============

An easy way to interact with APImetrics, the unbiased SaaS Platform
ensuring API products perform as agreed, are secure, meet business
objectives, and comply with regulations.

<!-- toc -->
* [Install](#install)
* [Usage](#usage)
* [Environment Variables](#environment-variables)
<!-- tocstop -->

# Install

## With npm
```sh-session
$ npm install -g @apimetrics/cli
```

# Usage
<!-- usage -->
```sh-session
$ npm install -g @apimetrics/cli
$ apimetrics COMMAND
running command...
$ apimetrics (--version)
@apimetrics/cli/0.0.1 darwin-arm64 node-v16.20.1
$ apimetrics --help [COMMAND]
USAGE
  $ apimetrics COMMAND
...
```
<!-- usagestop -->

# Environment Variables

| Name                        | Required | Description                                                                                                                                                     |
|-----------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `APIMETRICS_API_URL`        | :x:      | Base URL for the API. Defaults to `https://client.apimetrics.io/api/2/`.                                                                                        |
| `APIMETRICS_TOKEN_URL`      | :x:      | URL to use when requesting an access token for OAuth based login. Defaults to `https://auth.apimetrics.io/oauth/token`.                                         |
| `APIMETRICS_CODE_URL`       | :x:      | URL to use when requesting an authorization code for OAuth based login. Defaults to `https://auth.apimetrics.io/oauth/device/code`.                             |
| `APIMETRICS_REVOKE_URL`     | :x:      | URL to use when revoking refresh tokens. Defaults to `https://auth.apimetrics.io/oauth/revoke`.                                                                 |
| `APIMETRICS_CLIENT_ID`      | :x:      | Client ID to use for OAuth based login.                                                                                                                         |
| `APIMETRICS_CONFIG_DIR`     | :x:      | Directory to store configuration for the CLI. Defaults to `~/.config/apimetrics` on UNIX and `%LOCALAPPDATA%\apimetrics` on Windows.                            |
| ~~`XDG_CONFIG_HOME`~~       | :x:      | Directory to store configuration for the CLI. Not recommended for use. Use `APIMETRICS_CONFIG_DIR` instead. `APIMETRICS_CONFIG_DIR` takes priority if also set. |

<!-- commands -->
* [`apimetrics auth login`](#apimetrics-auth-login)
* [`apimetrics auth logout`](#apimetrics-auth-logout)
* [`apimetrics calls`](#apimetrics-calls)
* [`apimetrics config org set`](#apimetrics-config-org-set)
* [`apimetrics config project set`](#apimetrics-config-project-set)
* [`apimetrics help [COMMANDS]`](#apimetrics-help-commands)
* [`apimetrics login`](#apimetrics-login)
* [`apimetrics org accounts`](#apimetrics-org-accounts)
* [`apimetrics plugins`](#apimetrics-plugins)
* [`apimetrics plugins:install PLUGIN...`](#apimetrics-pluginsinstall-plugin)
* [`apimetrics plugins:inspect PLUGIN...`](#apimetrics-pluginsinspect-plugin)
* [`apimetrics plugins:install PLUGIN...`](#apimetrics-pluginsinstall-plugin-1)
* [`apimetrics plugins:link PLUGIN`](#apimetrics-pluginslink-plugin)
* [`apimetrics plugins:uninstall PLUGIN...`](#apimetrics-pluginsuninstall-plugin)
* [`apimetrics plugins:uninstall PLUGIN...`](#apimetrics-pluginsuninstall-plugin-1)
* [`apimetrics plugins:uninstall PLUGIN...`](#apimetrics-pluginsuninstall-plugin-2)
* [`apimetrics plugins update`](#apimetrics-plugins-update)
* [`apimetrics project pull`](#apimetrics-project-pull)
* [`apimetrics schedules`](#apimetrics-schedules)
* [`apimetrics workflows`](#apimetrics-workflows)

## `apimetrics auth login`

Login to APImetrics

```
USAGE
  $ apimetrics auth login [--json] [--key <value>]

FLAGS
  --key=<value>  API key when using API key auth

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Login to APImetrics

ALIASES
  $ apimetrics login

EXAMPLES
  $ apimetrics auth login --key <api key>
```

## `apimetrics auth logout`

Logout

```
USAGE
  $ apimetrics auth logout [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Logout

EXAMPLES
  $ apimetrics auth logout
```

## `apimetrics calls`

List all API calls

```
USAGE
  $ apimetrics calls [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all API calls

EXAMPLES
  $ apimetrics calls
```

_See code: [dist/commands/calls/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.1/dist/commands/calls/index.ts)_

## `apimetrics config org set`

Set the current working organisation

```
USAGE
  $ apimetrics config org set [--json] [-i <value>]

FLAGS
  -i, --org-id=<value>  ID of org to set to

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Set the current working organisation

EXAMPLES
  $ apimetrics config org set
```

## `apimetrics config project set`

Set the current working project

```
USAGE
  $ apimetrics config project set [--json] [-i <value>]

FLAGS
  -i, --project-id=<value>  ID of project to switch to

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Set the current working project

EXAMPLES
  $ apimetrics config project set
```

## `apimetrics help [COMMANDS]`

Display help for apimetrics.

```
USAGE
  $ apimetrics help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for apimetrics.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_

## `apimetrics login`

Login to APImetrics

```
USAGE
  $ apimetrics login [--json] [--key <value>]

FLAGS
  --key=<value>  API key when using API key auth

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Login to APImetrics

ALIASES
  $ apimetrics login

EXAMPLES
  $ apimetrics login --key <api key>
```

## `apimetrics org accounts`

List all users in organisation

```
USAGE
  $ apimetrics org accounts [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all users in organisation

EXAMPLES
  $ apimetrics org accounts
```

## `apimetrics plugins`

List installed plugins.

```
USAGE
  $ apimetrics plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ apimetrics plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/index.ts)_

## `apimetrics plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ apimetrics plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ apimetrics plugins add

EXAMPLES
  $ apimetrics plugins:install myplugin 

  $ apimetrics plugins:install https://github.com/someuser/someplugin

  $ apimetrics plugins:install someuser/someplugin
```

## `apimetrics plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ apimetrics plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ apimetrics plugins:inspect myplugin
```

## `apimetrics plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ apimetrics plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ apimetrics plugins add

EXAMPLES
  $ apimetrics plugins:install myplugin 

  $ apimetrics plugins:install https://github.com/someuser/someplugin

  $ apimetrics plugins:install someuser/someplugin
```

## `apimetrics plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ apimetrics plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ apimetrics plugins:link myplugin
```

## `apimetrics plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ apimetrics plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ apimetrics plugins unlink
  $ apimetrics plugins remove
```

## `apimetrics plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ apimetrics plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ apimetrics plugins unlink
  $ apimetrics plugins remove
```

## `apimetrics plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ apimetrics plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ apimetrics plugins unlink
  $ apimetrics plugins remove
```

## `apimetrics plugins update`

Update installed plugins.

```
USAGE
  $ apimetrics plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `apimetrics project pull`

Fetch project.yaml file

```
USAGE
  $ apimetrics project pull [--json] [-f -o <value>] [--environment] [--header] [--webhook]

FLAGS
  -f, --force         Force overwriting of existing project.yaml file.
  -o, --out=<value>   File to write project.yaml to.
  --[no-]environment  Include environment variable data
  --[no-]header       Include header data
  --[no-]webhook      Include webhook data

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Fetch project.yaml file

EXAMPLES
  $ apimetrics project pull --key <api key>
```

## `apimetrics schedules`

List all schedules

```
USAGE
  $ apimetrics schedules [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all schedules

EXAMPLES
  $ apimetrics schedules
```

_See code: [dist/commands/schedules/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.1/dist/commands/schedules/index.ts)_

## `apimetrics workflows`

List all workflows

```
USAGE
  $ apimetrics workflows [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all workflows

EXAMPLES
  $ apimetrics workflows
```

_See code: [dist/commands/workflows/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.1/dist/commands/workflows/index.ts)_
<!-- commandsstop -->
