APImetrics CLI
==============

An easy way to interact with APImetrics, the unbiased SaaS Platform
ensuring API products perform as agreed, are secure, meet business
objectives, and comply with regulations.

<!-- toc -->
* [Install](#install)
* [Usage](#usage)
* [Environment Variables](#environment-variables)
* [Command Topics](#command-topics)
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
@apimetrics/cli/0.1.1 darwin-arm64 node-v16.20.2
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
# Command Topics

* [`apimetrics auth`](docs/auth.md) - Manage authentication options.
* [`apimetrics calls`](docs/calls.md) - Manage monitoring calls.
* [`apimetrics config`](docs/config.md) - Manage CLI configuration options.
* [`apimetrics help`](docs/help.md) - Display help for apimetrics.
* [`apimetrics info`](docs/info.md) - Information about APImetrics monitoring infrastructure.
* [`apimetrics org`](docs/org.md) - Manage organization settings.
* [`apimetrics plugins`](docs/plugins.md) - List installed plugins.
* [`apimetrics projects`](docs/projects.md) - Manage projects.
* [`apimetrics schedules`](docs/schedules.md) - Manage project schedules.
* [`apimetrics webhooks`](docs/webhooks.md) - Manage project webhooks and alerts.
* [`apimetrics workflows`](docs/workflows.md) - Manage project workflows.

<!-- commandsstop -->
