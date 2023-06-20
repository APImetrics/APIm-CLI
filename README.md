APImetrics CLI
==============

An easy way to interact with APImetrics, the unbiased SaaS Platform
ensuring API products perform as agreed, are secure, meet business
objectives, and comply with regulations.

<!-- toc -->
* [Install](#install)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Install

## With npm
```sh-session
$ npm install -g @apimetrics/cli
```

# Usage
<!-- usage -->
```sh-session
$ apimetrics COMMAND
running command...
$ apimetrics (--version)
cli/0.0.0 linux-x64 node-v18.12.1
$ apimetrics --help [COMMAND]
USAGE
  $ apimetrics COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`apimetrics auth login`](#apimetrics-auth-login)
* [`apimetrics hello PERSON`](#apimetrics-hello-person)
* [`apimetrics hello world`](#apimetrics-hello-world)
* [`apimetrics help [COMMANDS]`](#apimetrics-help-commands)
* [`apimetrics login`](#apimetrics-login)
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

## `apimetrics hello PERSON`

Say hello

```
USAGE
  $ apimetrics hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.0/dist/commands/hello/index.ts)_

## `apimetrics hello world`

Say hello world

```
USAGE
  $ apimetrics hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ apimetrics hello world
  hello world! (./src/commands/hello/world.ts)
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
<!-- commandsstop -->
