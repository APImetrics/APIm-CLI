APImetrics CLI
==============

An easy way to interact with APImetrics, the unbiased SaaS Platform
ensuring API products perform as agreed, are secure, meet business
objectives, and comply with regulations.

<!-- toc -->
* [Install](#install)
  * [Requirements](#requirements)
    * [Networking](#networking)
    * [Supported OS & Architectures](#supported-os-and-architectures)
    * [Supported Node.js Versions](#supported-nodejs-versions)
  * [Methods](#methods)
    * [Using npm](#using-npm)
    * [Using Tarballs](#using-tarballs)
* [Usage](#usage)
* [Login](#login)
* [Command Topics](#command-topics)
* [Environment Variables](#environment-variables)
<!-- tocstop -->

# Install

## Requirements

### Networking

The CLI will require an internet connection that allows access to the
following domains in order to function properly. If you are adding
firewall rules to allow this, we highly suggest that your firewall is
configured to refresh the IP addresses for the domains on a regular
basis as they may change without prior notice.

| Domain               | Ports   |
|----------------------|---------|
| client.apimetrics.io | 80, 443 |
| auth.apimetrics.io   | 80, 443 |

### Supported OS and Architectures

Both x64 and ARM architectures are supported with the following
operating systems:

| OS         | Supported          |
|------------|--------------------|
| Windows 11 | :white_check_mark: |
| Windows 10 | :white_check_mark: |
| Windows 7  | :x:                |
| Linux      | :white_check_mark: |
| macOS      | :white_check_mark: |

### Supported Node.js Versions

We support all current and LTS versions of Node.js. When a version moves
to end-of-life, we will drop support. If you are currently using a
version of Node.js that is currently end-of-life, we suggest you upgrade
to a newer version. More information about currently supported Node.js
versions is published by the [Node.js Release Working
Group](https://github.com/nodejs/Release).

| Version | Supported          |
|---------|--------------------|
| 21.x    | :white_check_mark: |
| 20.x    | :white_check_mark: |
| 18.x    | :white_check_mark: |
| 16.x    | :x:                |

## Methods
### Using npm

The CLI is built with Node.js and can be installed using `npm`. In order
to use this method, you must have `node` and `npm` installed on your
system already. You can find download instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). To download run the following command:

```sh-session
npm install -g @apimetrics/cli
```

### Using Tarballs

These are standalone distributions containing their own Node.js binary
and the CLI. They do not require any other software to already be
installed on your system.

The tarballs are available in both `gz` and `xz` formats. `xz` is much
smaller so ideal for slow connections, however `gz` has wider support
from decompression software. If you are unsure of which to use, use `gz`.

To find the latest version of your desired tarball, go to our [latest release](https://github.com/APImetrics/APIm-CLI/releases).

Once you have downloaded the tarball for your system, you should then
extract to a location such as `/usr/local/bin/apimetrics` and ensure
that this location is on your `PATH`.

# Usage
```sh-session
$ npm install -g @apimetrics/cli
$ apimetrics COMMAND
running command...
$ apimetrics (--version)
@apimetrics/cli/0.2.1 darwin-arm64 node-v20.9.0
$ apimetrics --help [COMMAND]
USAGE
  $ apimetrics COMMAND
...
```

# Login

To start using the APImetrics CLI, you must log into your account. If you don't have an account with APImetrics, you can sign up [here](https://client.apimetrics.io/register). To log in, run the following command:

```sh-session
  apimetrics login
```

You will be redirected to a page in your browser with a code. Check this code is the same as the code displayed in your APImetrics CLI. If they are, click confirm. If you have multi-factor authentication enabled for APImetrics, you will be asked to input your one-time code. After this, you will be logged in and be able to return to your CLI.

![Screenshot of the code to confirm device for CLI usage](/docs/images/home/cli-image.png)

Now that you are logged in, the CLI will ask you to select one of the Organizations you are part of to work on. Once this is selected, it will ask you to select the Project you want to work on. Now you are ready to start with your CLI.

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

# Environment Variables

| Name                        | Required | Description                                                                                                                                                     |
|-----------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `APIMETRICS_API_URL`        | :x:      | Base URL for the API. Defaults to `https://client.apimetrics.io/api/2/`.                                                                                        |
| `APIMETRICS_TOKEN_URL`      | :x:      | URL to use when requesting an access token for OAuth-based login. Defaults to `https://auth.apimetrics.io/oauth/token`.                                         |
| `APIMETRICS_CODE_URL`       | :x:      | URL to use when requesting an authorization code for OAuth-based login. Defaults to `https://auth.apimetrics.io/oauth/device/code`.                             |
| `APIMETRICS_REVOKE_URL`     | :x:      | URL to use when revoking refresh tokens. Defaults to `https://auth.apimetrics.io/oauth/revoke`.                                                                 |
| `APIMETRICS_USERINFO_URL`   | :x:      | URL to use when fetching user info. Defaults to `https://auth.apimetrics.io/userinfo`.                                                                          |
| `APIMETRICS_CLIENT_ID`      | :x:      | Client ID to use for OAuth-based login.                                                                                                                         |
| `APIMETRICS_CONFIG_DIR`     | :x:      | Directory to store configuration for the CLI. Defaults to `~/.config/apimetrics` on UNIX and `%LOCALAPPDATA%\apimetrics` on Windows.                            |
| ~~`XDG_CONFIG_HOME`~~      | :x:      | Directory to store configuration for the CLI. Not recommended for use. Use `APIMETRICS_CONFIG_DIR` instead. `APIMETRICS_CONFIG_DIR` takes priority if also set. |
