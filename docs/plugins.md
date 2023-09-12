`apimetrics plugins`
====================

List installed plugins.

* [`apimetrics plugins`](#apimetrics-plugins)
* [`apimetrics plugins:install PLUGIN...`](#apimetrics-pluginsinstall-plugin)
* [`apimetrics plugins:inspect PLUGIN...`](#apimetrics-pluginsinspect-plugin)
* [`apimetrics plugins:install PLUGIN...`](#apimetrics-pluginsinstall-plugin-1)
* [`apimetrics plugins:link PLUGIN`](#apimetrics-pluginslink-plugin)
* [`apimetrics plugins:uninstall PLUGIN...`](#apimetrics-pluginsuninstall-plugin)
* [`apimetrics plugins:uninstall PLUGIN...`](#apimetrics-pluginsuninstall-plugin-1)
* [`apimetrics plugins:uninstall PLUGIN...`](#apimetrics-pluginsuninstall-plugin-2)
* [`apimetrics plugins update`](#apimetrics-plugins-update)

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
