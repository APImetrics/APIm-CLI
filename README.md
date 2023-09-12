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
@apimetrics/cli/0.0.2 darwin-arm64 node-v16.20.1
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
* [`apimetrics calls create`](#apimetrics-calls-create)
* [`apimetrics calls edit`](#apimetrics-calls-edit)
* [`apimetrics calls schedules add`](#apimetrics-calls-schedules-add)
* [`apimetrics calls schedules delete`](#apimetrics-calls-schedules-delete)
* [`apimetrics config org set`](#apimetrics-config-org-set)
* [`apimetrics config project set`](#apimetrics-config-project-set)
* [`apimetrics help [COMMANDS]`](#apimetrics-help-commands)
* [`apimetrics info locations`](#apimetrics-info-locations)
* [`apimetrics info regions`](#apimetrics-info-regions)
* [`apimetrics login`](#apimetrics-login)
* [`apimetrics org accounts`](#apimetrics-org-accounts)
* [`apimetrics org accounts edit`](#apimetrics-org-accounts-edit)
* [`apimetrics org accounts remove`](#apimetrics-org-accounts-remove)
* [`apimetrics org invites`](#apimetrics-org-invites)
* [`apimetrics org invites create`](#apimetrics-org-invites-create)
* [`apimetrics org invites delete`](#apimetrics-org-invites-delete)
* [`apimetrics org roles`](#apimetrics-org-roles)
* [`apimetrics org roles create`](#apimetrics-org-roles-create)
* [`apimetrics org roles delete`](#apimetrics-org-roles-delete)
* [`apimetrics plugins`](#apimetrics-plugins)
* [`apimetrics plugins:install PLUGIN...`](#apimetrics-pluginsinstall-plugin)
* [`apimetrics plugins:inspect PLUGIN...`](#apimetrics-pluginsinspect-plugin)
* [`apimetrics plugins:install PLUGIN...`](#apimetrics-pluginsinstall-plugin-1)
* [`apimetrics plugins:link PLUGIN`](#apimetrics-pluginslink-plugin)
* [`apimetrics plugins:uninstall PLUGIN...`](#apimetrics-pluginsuninstall-plugin)
* [`apimetrics plugins:uninstall PLUGIN...`](#apimetrics-pluginsuninstall-plugin-1)
* [`apimetrics plugins:uninstall PLUGIN...`](#apimetrics-pluginsuninstall-plugin-2)
* [`apimetrics plugins update`](#apimetrics-plugins-update)
* [`apimetrics projects`](#apimetrics-projects)
* [`apimetrics projects accounts`](#apimetrics-projects-accounts)
* [`apimetrics projects accounts edit`](#apimetrics-projects-accounts-edit)
* [`apimetrics projects create`](#apimetrics-projects-create)
* [`apimetrics projects invites`](#apimetrics-projects-invites)
* [`apimetrics projects invites create`](#apimetrics-projects-invites-create)
* [`apimetrics projects invites delete`](#apimetrics-projects-invites-delete)
* [`apimetrics projects pull`](#apimetrics-projects-pull)
* [`apimetrics projects roles`](#apimetrics-projects-roles)
* [`apimetrics projects roles edit`](#apimetrics-projects-roles-edit)
* [`apimetrics schedules`](#apimetrics-schedules)
* [`apimetrics schedules calls`](#apimetrics-schedules-calls)
* [`apimetrics schedules calls add`](#apimetrics-schedules-calls-add)
* [`apimetrics schedules calls remove`](#apimetrics-schedules-calls-remove)
* [`apimetrics webhooks`](#apimetrics-webhooks)
* [`apimetrics webhooks create`](#apimetrics-webhooks-create)
* [`apimetrics webhooks delete`](#apimetrics-webhooks-delete)
* [`apimetrics webhooks edit`](#apimetrics-webhooks-edit)
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

List API calls in project.

```
USAGE
  $ apimetrics calls [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set.
  -x, --extended            show extra columns
  --columns=<value>         only show provided columns (comma-separated)
  --csv                     output is csv format [alias: --output=csv]
  --filter=<value>          filter property by partial string matching, ex: name=foo
  --no-header               hide table header from output
  --no-truncate             do not truncate output to fit screen
  --output=<option>         output in a more machine friendly format
                            <options: csv|json|yaml>
  --sort=<value>            property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List API calls in project.

EXAMPLES
  $ apimetrics calls
  Name   Description Method  URL
  ────── ─────────── ─────── ─────────────────────────────
  Apples null        GET     https://example.com/v1/apples

  $ apimetrics calls --columns name,id
  Name   ID
  ────── ────────────────────────────────────────────────────────
  Apples ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9f3DuAoM
```

_See code: [dist/commands/calls/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.2/dist/commands/calls/index.ts)_

## `apimetrics calls create`

Create a new API call.

```
USAGE
  $ apimetrics calls create -n <value> -u <value> [--json] [-m
    get|GET|head|HEAD|post|POST|put|PUT|patch|PATCH|delete|DELETE|options|OPTIONS] [--accept <value>] [--header <value>]
    [--tag <value>] [-p <value>] [--description <value>] [--body <value>]

FLAGS
  -m, --method=<option>     [default: GET] HTTP method to use.
                            <options: get|GET|head|HEAD|post|POST|put|PUT|patch|PATCH|delete|DELETE|options|OPTIONS>
  -n, --name=<value>        (required) Name of API call.
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set.
  -u, --url=<value>         (required) URL to call.
  --accept=<value>          MIME type for accept header. Alias for --header Accept: <MIME type>.
  --body=<value>            Request body.
  --description=<value>     Call description.
  --header=<value>...       Header to add to call.
  --tag=<value>...          Tag to add to call.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a new API call.

EXAMPLES
  $ apimetrics calls create --name Apples --url https://example.com/v1/apples
  ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9f3DuAoM

  $ apimetrics calls create --name Oranges --url https://example.com/v1/oranges --method POST --header "Content-Type: application/json" --body '{"quantity": 3}'
  ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXRjklafJhslw62dahoM
```

## `apimetrics calls edit`

Edit an existing API call.

```
USAGE
  $ apimetrics calls edit -c <value> [--json] [-n <value>] [-u <value>] [-m
    get|GET|head|HEAD|post|POST|put|PUT|patch|PATCH|delete|DELETE|options|OPTIONS] [--accept <value>] [--add-header
    <value>] [--replace-header <value>] [--remove-header <value>] [--add-tag <value>] [--remove-tag <value>] [-p
    <value>] [--description <value>] [--body <value>]

FLAGS
  -c, --call-id=<value>        (required) ID of call.
  -m, --method=<option>        HTTP method to use.
                               <options: get|GET|head|HEAD|post|POST|put|PUT|patch|PATCH|delete|DELETE|options|OPTIONS>
  -n, --name=<value>           Name of API call.
  -p, --project-id=<value>     ID of project to modify. Overrides apimetrics config project set.
  -u, --url=<value>            URL to call.
  --accept=<value>             MIME type for accept header. Alias for --replace-header Accept: <MIME type>.
  --add-header=<value>...      Add header to the call. Specify in the form <key>: <value>.
  --add-tag=<value>...         Name of tag to add. No effect if the tag already exists.
  --body=<value>               Request body.
  --description=<value>        Call description.
  --remove-header=<value>...   Name of header to remove.
  --remove-tag=<value>...      Name of tag to remove.
  --replace-header=<value>...  Add header to the call or replace if it already exists. Specify in the form <key>:
                               <value>.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Edit an existing API call.

EXAMPLES
  $ apimetrics calls edit --call-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9f3DuAoM --url https://example.com/v2/apples
```

## `apimetrics calls schedules add`

Add call to schedule.

```
USAGE
  $ apimetrics calls schedules add -s <value> -c <value> [--json] [-p <value>]

FLAGS
  -c, --call-id=<value>      (required) ID of call to add.
  -p, --project-id=<value>   ID of project to modify. Overrides apimetrics config project set.
  -s, --schedule-id=<value>  (required) ID of schedule to modify.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Add call to schedule.

ALIASES
  $ apimetrics calls schedules add

EXAMPLES
  $ apimetrics calls schedules add --schedule-id ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Pbn4ZILDA --call-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9f3DuAoM
```

## `apimetrics calls schedules delete`

Remove call from schedule

```
USAGE
  $ apimetrics calls schedules delete -s <value> -c <value> [--json] [-p <value>]

FLAGS
  -c, --call-id=<value>      (required) ID of call to remove.
  -p, --project-id=<value>   ID of project to modify. Overrides apimetrics config project set.
  -s, --schedule-id=<value>  (required) ID of schedule to modify.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Remove call from schedule

ALIASES
  $ apimetrics calls schedules delete

EXAMPLES
  $ apimetrics calls schedules delete --schedule-id ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Pbn4ZILDA --call-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXRjklafJhslw62dahoM
```

## `apimetrics config org set`

Set the current working organization.

```
USAGE
  $ apimetrics config org set [--json] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of org to set to.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Set the current working organization.

EXAMPLES
  $ apimetrics config org set  --org-id abccorp
```

## `apimetrics config project set`

Set the current working project

```
USAGE
  $ apimetrics config project set [--json] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to switch to

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

## `apimetrics info locations`

List all available agent locations.

```
USAGE
  $ apimetrics info locations [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  List all available agent locations.

EXAMPLES
  $ apimetrics info locations
  Name                   IP
  ────────────────────── ──────────────
  public_awsuswest       54.191.239.225
  public_azureasiase     13.67.53.204
  public_googleuscentral 35.226.77.27
```

## `apimetrics info regions`

List all available regions.

```
USAGE
  $ apimetrics info regions [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  List all available regions.

EXAMPLES
  $ apimetrics info regions
  Name            ID
  ─────────────── ───
  IBM Cloud       sft
  Europe          eu
  Microsoft Azure azr
  North America   na
```

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

List all users in organization.

```
USAGE
  $ apimetrics org accounts [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of organization to read. Overrides apimetrics config org set.
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --sort=<value>        property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all users in organization.

EXAMPLES
  $ apimetrics org accounts
  Name              Email             Roles                    Last login
  ───────────────── ───────────────── ──────────────────────── ────────────────────────
  alice@example.com alice@example.com DEFAULT                  2023-08-02T21:15:48.072Z
  Bob               bob@example.com   DEFAULT, ADMIN, DEV_TEAM 2023-08-01T23:41:07.733Z 

  $ apimetrics org accounts
  Name              ID
  ───────────────── ──────────────────────────────
  alice@example.com auth0|abcdefghijklmnopqrstuvwx
  Bob               auth0|zyxwvutsrqponmlkjihgfedc
```

## `apimetrics org accounts edit`

Edit an account.

```
USAGE
  $ apimetrics org accounts edit [--json] [-u <value>] [--add-role <value>] [--remove-role <value>] [-o <value>]

FLAGS
  -o, --org-id=<value>      ID of organization to modify. Overrides apimetrics config org set.
  -u, --user-id=<value>     ID of user
  --add-role=<value>...     Add a role to the account.
  --remove-role=<value>...  Name of role to remove.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Edit an account.

EXAMPLES
  $ apimetrics org accounts edit --add-role ADMIN --remove-role DEV_TEAM
```

## `apimetrics org accounts remove`

Remove an account from the organization.

```
USAGE
  $ apimetrics org accounts remove -u <value> [--json] [-o <value>]

FLAGS
  -o, --org-id=<value>   ID of organization to modify. Overrides apimetrics config org set.
  -u, --user-id=<value>  (required) ID of user to remove.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Remove an account from the organization.

EXAMPLES
  $ apimetrics org accounts remove --user-id "auth0|abcdefghijklmnopqrstuvwx"
```

## `apimetrics org invites`

List invites in an organization.

```
USAGE
  $ apimetrics org invites [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of organization to read. Overrides apimetrics config org set.
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --sort=<value>        property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List invites in an organization.

EXAMPLES
  $ apimetrics org invites
  Email             Roles    Created
  ───────────────── ──────── ───────────────────────────
  bob@example.com   ADMIN    2023-07-15T18:32:41.626327Z
  alice@example.com DEV_TEAM 2023-07-15T18:34:27.044198Z
```

## `apimetrics org invites create`

Create an invite to the organization.

```
USAGE
  $ apimetrics org invites create --email <value> --role <value> [--json] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of organization to modify. Overrides apimetrics config org set.
  --email=<value>       (required) Email to send invite to.
  --role=<value>...     (required) Users role.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create an invite to the organization.

EXAMPLES
  $ apimetrics org invites create --email bob@example.com --role ADMIN --role DEV_TEAM
  ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9ajJsyoM
```

## `apimetrics org invites delete`

Delete an invite to the organization.

```
USAGE
  $ apimetrics org invites delete --invite-id <value> [--json] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of organization to modify. Overrides apimetrics config org set.
  --invite-id=<value>   (required) Invite to delete.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete an invite to the organization.

EXAMPLES
  $ apimetrics org invites delete --invite-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9ajJsyoM
```

## `apimetrics org roles`

List roles in the organization.

```
USAGE
  $ apimetrics org roles [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of organization to read. Overrides apimetrics config org set.
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --sort=<value>        property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List roles in the organization.

EXAMPLES
  $ apimetrics org roles
  Role   Description                     Created
  ────── ─────────────────────────────── ───────────────────────────
  ADMIN  Organization Administrator Role 2021-02-25T01:53:42.656838Z
  TEAM_A Development team A              2023-07-16T21:53:30.522729Z
```

## `apimetrics org roles create`

Create a role in the organization.

```
USAGE
  $ apimetrics org roles create -n <value> -d <value> [--json] [-o <value>]

FLAGS
  -d, --description=<value>  (required) Role description.
  -n, --name=<value>         (required) Name of role.
  -o, --org-id=<value>       ID of organization to modify. Overrides apimetrics config org set.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a role in the organization.

EXAMPLES
  $ apimetrics org roles create --name TEAM_A --description "Development team A"
  TEAM_A
```

## `apimetrics org roles delete`

Delete a role from the organization.

```
USAGE
  $ apimetrics org roles delete -r <value> [--json] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of organization to modify. Overrides apimetrics config org set.
  -r, --role=<value>    (required) ID of role to delete.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete a role from the organization.

EXAMPLES
  $ apimetrics org roles delete --role TEAM_A
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

## `apimetrics projects`

List all projects in an organisation that the current user has access to.

```
USAGE
  $ apimetrics projects [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of organization to modify. Overrides apimetrics config org set.
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --sort=<value>        property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all projects in an organisation that the current user has access to.

EXAMPLES
  $ apimetrics projects
   Name       Tags Created
   ────────── ──── ───────────────────────────
   My Project None 2023-07-21T14:11:07.321416Z
```

_See code: [dist/commands/projects/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.2/dist/commands/projects/index.ts)_

## `apimetrics projects accounts`

List users with access to the project.

```
USAGE
  $ apimetrics projects accounts [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set.
  -x, --extended            show extra columns
  --columns=<value>         only show provided columns (comma-separated)
  --csv                     output is csv format [alias: --output=csv]
  --filter=<value>          filter property by partial string matching, ex: name=foo
  --no-header               hide table header from output
  --no-truncate             do not truncate output to fit screen
  --output=<option>         output in a more machine friendly format
                            <options: csv|json|yaml>
  --sort=<value>            property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List users with access to the project.

EXAMPLES
  $ apimetrics projects accounts
  Email             Access Level
  ───────────────── ────────────
  bob@example.com   VIEWER
  alice@example.com OWNER
```

## `apimetrics projects accounts edit`

Edit account access for the project.

```
USAGE
  $ apimetrics projects accounts edit [--json] [--add-owner <value>] [--remove-owner <value>] [--add-editor <value>]
    [--remove-editor <value>] [--add-analyst <value>] [--remove-analyst <value>] [--add-viewer <value>] [--remove-viewer
    <value>] [-p <value>]

FLAGS
  -p, --project-id=<value>     ID of project to read. Overrides apimetrics config project set.
  --add-analyst=<value>...     ID of user to add as an analyst.
  --add-editor=<value>...      ID of user to add as an editor.
  --add-owner=<value>...       ID of user to add as an owner.
  --add-viewer=<value>...      ID of user to add as a viewer.
  --remove-analyst=<value>...  ID of user to remove as an analyst
  --remove-editor=<value>...   ID of user to remove as an editor
  --remove-owner=<value>...    ID of user to remove as an owner
  --remove-viewer=<value>...   ID of user to remove as an viewer

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Edit account access for the project.

EXAMPLES
  $ apimetrics projects accounts edit --add-owner auth0|abcdefghijklmnopqrstuvwx --remove-viewer auth0|zyxwvutsrqponmlkjihgfedc
```

## `apimetrics projects create`

Create a new project.

```
USAGE
  $ apimetrics projects create -n <value> [--json] [--owner-user <value>] [--owner-role <value>] [--editor-user
    <value>] [--editor-role <value>] [--analyst-user <value>] [--analyst-role <value>] [--viewer-user <value>]
    [--viewer-role <value>] [-o <value>]

FLAGS
  -n, --name=<value>         (required) Name of project.
  -o, --org-id=<value>       ID of organization to modify. Overrides apimetrics config org set.
  --analyst-role=<value>...  ID of role to give analyst access.
  --analyst-user=<value>...  ID of user to give analyst access.
  --editor-role=<value>...   ID of role to give editor access.
  --editor-user=<value>...   ID of user to give editor access.
  --owner-role=<value>...    ID of role to give owner access.
  --owner-user=<value>...    ID of user to give owner access.
  --viewer-role=<value>...   ID of role to give viewer access.
  --viewer-user=<value>...   ID of user to give viewer access.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a new project.

EXAMPLES
  $ apimetrics projects create --name "My Project"
  ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDgtdTd3QkM

  $ apimetrics projects create --name "My Project" --owner-role ADMIN --viewer-user "auth0|abcdefghijklmnopqrstuvwx"
  ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDgtj9TyQkM
```

## `apimetrics projects invites`

List invites in the project.

```
USAGE
  $ apimetrics projects invites [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set.
  -x, --extended            show extra columns
  --columns=<value>         only show provided columns (comma-separated)
  --csv                     output is csv format [alias: --output=csv]
  --filter=<value>          filter property by partial string matching, ex: name=foo
  --no-header               hide table header from output
  --no-truncate             do not truncate output to fit screen
  --output=<option>         output in a more machine friendly format
                            <options: csv|json|yaml>
  --sort=<value>            property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List invites in the project.

EXAMPLES
  $ apimetrics projects invites
  Email             Access Level Created
  ───────────────── ──────────── ───────────────────────────
  alice@example.com VIEWER       2023-08-03T22:28:02.141461Z
```

## `apimetrics projects invites create`

Create an invite to the project.

```
USAGE
  $ apimetrics projects invites create --email <value> --access-level owner|editor|analyst|viewer [--json] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set.
  --access-level=<option>   (required) Access level.
                            <options: owner|editor|analyst|viewer>
  --email=<value>           (required) Email to send invite to.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create an invite to the project.

EXAMPLES
  $ apimetrics projects invites create --email alice@example.com --access-level editor
  ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

## `apimetrics projects invites delete`

Delete an invite to the project.

```
USAGE
  $ apimetrics projects invites delete --invite-id <value> [--json] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set.
  --invite-id=<value>       (required) Invite to delete.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete an invite to the project.

EXAMPLES
  $ apimetrics projects invites delete --invite-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

## `apimetrics projects pull`

Fetch project.yaml file.

```
USAGE
  $ apimetrics projects pull [--json] [-f -o <value>] [--environment] [--header] [--webhook] [-p <value>]

FLAGS
  -f, --force               Force overwriting of existing project.yaml file.
  -o, --out=<value>         File to write project.yaml to.
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set.
  --[no-]environment        Include environment variable data.
  --[no-]header             Include header data.
  --[no-]webhook            Include webhook data.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Fetch project.yaml file.

EXAMPLES
  $ apimetrics projects pull --out myproject.yaml
  Wrote project.yaml to myproject.yaml.
```

## `apimetrics projects roles`

List all roles with access to the project.

```
USAGE
  $ apimetrics projects roles [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set.
  -x, --extended            show extra columns
  --columns=<value>         only show provided columns (comma-separated)
  --csv                     output is csv format [alias: --output=csv]
  --filter=<value>          filter property by partial string matching, ex: name=foo
  --no-header               hide table header from output
  --no-truncate             do not truncate output to fit screen
  --output=<option>         output in a more machine friendly format
                            <options: csv|json|yaml>
  --sort=<value>            property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all roles with access to the project.

EXAMPLES
  $ apimetrics projects roles
  Role      Access Level
  ───────── ────────────
  DEBUGGING EDITOR
  DEBUGGING ANALYST
  DEFAULT   EDITOR
  DEV_TEAM  EDITOR
  ADMIN     VIEWER
```

## `apimetrics projects roles edit`

Edit role access on the project.

```
USAGE
  $ apimetrics projects roles edit [--json] [--add-owner <value>] [--remove-owner <value>] [--add-editor <value>]
    [--remove-editor <value>] [--add-analyst <value>] [--remove-analyst <value>] [--add-viewer <value>] [--remove-viewer
    <value>] [-p <value>]

FLAGS
  -p, --project-id=<value>     ID of project to read. Overrides apimetrics config project set.
  --add-analyst=<value>...     ID of role to add as an analyst.
  --add-editor=<value>...      ID of role to add as an editor.
  --add-owner=<value>...       ID of role to add as an owner.
  --add-viewer=<value>...      ID of role to add as a viewer.
  --remove-analyst=<value>...  ID of role to remove as an analyst.
  --remove-editor=<value>...   ID of role to remove as an editor
  --remove-owner=<value>...    ID of role to remove as an owner
  --remove-viewer=<value>...   ID of role to remove as an viewer

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Edit role access on the project.

EXAMPLES
  $ apimetrics projects roles edit --add-owner ADMIN --remove-editor DEBUG
```

## `apimetrics schedules`

List schedules.

```
USAGE
  $ apimetrics schedules [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set.
  -x, --extended            show extra columns
  --columns=<value>         only show provided columns (comma-separated)
  --csv                     output is csv format [alias: --output=csv]
  --filter=<value>          filter property by partial string matching, ex: name=foo
  --no-header               hide table header from output
  --no-truncate             do not truncate output to fit screen
  --output=<option>         output in a more machine friendly format
                            <options: csv|json|yaml>
  --sort=<value>            property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List schedules.

EXAMPLES
  $ apimetrics schedules
  Name          Frequency        Regions
  ───────────── ──────────────── ───────
  High freq     Every 10 seconds all
  Schedule 2    Every 5 minutes  all, oc
```

_See code: [dist/commands/schedules/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.2/dist/commands/schedules/index.ts)_

## `apimetrics schedules calls`

List calls on the schedule.

```
USAGE
  $ apimetrics schedules calls -s <value> [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>   ID of project to read. Overrides apimetrics config project set.
  -s, --schedule-id=<value>  (required) ID of schedule to read.
  -x, --extended             show extra columns
  --columns=<value>          only show provided columns (comma-separated)
  --csv                      output is csv format [alias: --output=csv]
  --filter=<value>           filter property by partial string matching, ex: name=foo
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --output=<option>          output in a more machine friendly format
                             <options: csv|json|yaml>
  --sort=<value>             property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List calls on the schedule.

EXAMPLES
  $ apimetrics schedules calls --schedule-id ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Pbn4ZILDA
  Name   Description Method URL
  ────── ─────────── ────── ──────────────────────────
  Apples             GET    https://example.com/apples
```

## `apimetrics schedules calls add`

Add call to schedule.

```
USAGE
  $ apimetrics schedules calls add -s <value> -c <value> [--json] [-p <value>]

FLAGS
  -c, --call-id=<value>      (required) ID of call to add.
  -p, --project-id=<value>   ID of project to modify. Overrides apimetrics config project set.
  -s, --schedule-id=<value>  (required) ID of schedule to modify.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Add call to schedule.

ALIASES
  $ apimetrics calls schedules add

EXAMPLES
  $ apimetrics schedules calls add --schedule-id ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Pbn4ZILDA --call-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9f3DuAoM
```

## `apimetrics schedules calls remove`

Remove call from schedule

```
USAGE
  $ apimetrics schedules calls remove -s <value> -c <value> [--json] [-p <value>]

FLAGS
  -c, --call-id=<value>      (required) ID of call to remove.
  -p, --project-id=<value>   ID of project to modify. Overrides apimetrics config project set.
  -s, --schedule-id=<value>  (required) ID of schedule to modify.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Remove call from schedule

ALIASES
  $ apimetrics calls schedules delete

EXAMPLES
  $ apimetrics schedules calls remove --schedule-id ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Pbn4ZILDA --call-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXRjklafJhslw62dahoM
```

## `apimetrics webhooks`

List webhooks on a project.

```
USAGE
  $ apimetrics webhooks [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set.
  -x, --extended            show extra columns
  --columns=<value>         only show provided columns (comma-separated)
  --csv                     output is csv format [alias: --output=csv]
  --filter=<value>          filter property by partial string matching, ex: name=foo
  --no-header               hide table header from output
  --no-truncate             do not truncate output to fit screen
  --output=<option>         output in a more machine friendly format
                            <options: csv|json|yaml>
  --sort=<value>            property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List webhooks on a project.

EXAMPLES
  $ apimetrics webhooks
  Name         Type      Enabled Include Tags Exclude Tags
  ──────────── ───────── ─────── ──────────── ────────────
  Email        email     true    None         None
  DataDoggg    datadog   false   None         None
  Slack        slack     true    None         None
  GEn          generic   false   None         None
```

_See code: [dist/commands/webhooks/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.2/dist/commands/webhooks/index.ts)_

## `apimetrics webhooks create`

Create a new webhook.

```
USAGE
  $ apimetrics webhooks create -n <value> --type
    generic|apimetrics_api|apimetrics_workflow|apimetrics_token|email|email_text|email_template|big_panda|darkspark|data
    dog|datadogevent|flowdock|hipchat|msteams|newrelic|opsgenie|opsgenieeu|pager_duty|pager_duty_v2|slack|statuspage|vic
    torops --alert PASS|SLOW|WARNING|FAIL [--json] [--fails-in-a-row <value>] [--email-address <value>]
    [--subject-template <value>] [--text-template <value>] [--url <value>] [--username <value>] [--password <value>]
    [--call-id <value>] [--workflow-id <value>] [--token-id <value>] [--channel <value>] [--integration-key <value>]
    [--severity critical|error|warning|info] [--user-key <value>] [--app-key <value>] [--api-key <value>] [--routing-key
    <value>] [--page-id <value>] [--component-id <value>] [--flow-token <value>] [--include-tags <value>]
    [--exclude-tags <value>] [-p <value>]

FLAGS
  -n, --name=<value>
      (required) Name of project.

  -p, --project-id=<value>
      ID of project to read. Overrides apimetrics config project set.

  --alert=<option>...
      (required) Fire webhook on these result types.
      <options: PASS|SLOW|WARNING|FAIL>

  --api-key=<value>
      API key to use for authentication. Used by: [victorops: required, newrelic: required, datadog: required,
      datadogevent: required, statuspage: required, opsgenie: required, opsgenieeu: required].

  --app-key=<value>
      App key to use to identify this app. Used by [big_panda: required, newrelic: required].

  --call-id=<value>
      APImetrics API call to run. Used by [apimetrics_api: required].

  --channel=<value>
      Integration channel name if different from that defined in the slack integration. Used by [slack: optional].

  --component-id=<value>
      StatusPage component ID. Used by [statuspage: required].

  --email-address=<value>
      Your email address. Used by [email: required, email_text: required, email_template: required].

  --exclude-tags=<value>...
      Exclude calls with this tag.

  --fails-in-a-row=<value>
      Trigger webhook after this many successive failures. Used by all except apimetrics_token.

  --flow-token=<value>
      The token for the flow to post to. Used by [flowdock: required].

  --include-tags=<value>...
      Include calls with this tag.

  --integration-key=<value>
      The service integration key with Integration Type: APImetrics. Used by [pager_duty: required, pager_duty_v2:
      required].

  --page-id=<value>
      Page ID for StatusPage. Used by [statuspage: required].

  --password=<value>
      Password to use for authentication. Used by [generic: optional].

  --routing-key=<value>
      Routing key to route alert. Used by [victorops: optional].

  --severity=<option>
      Severity of alert. Used by [pager_duty_v2: optional].
      <options: critical|error|warning|info>

  --subject-template=<value>
      [default: [{{result_class}}]: APImetrics: {{ call_meta.name }}] Template for subject line. Used by [email_template:
      required].

  --text-template=<value>
      [default: {{ result }}: HTTP {{ http_code }} {{ http_reason }}
      Latency: {{ response_time }} ms
      Size: {{ response_size }} bytes

      Variables:
      {% for key, value in context|dictsort -%}
      - {{ key }}: {% if value is mapping %}...{% else %}{{ value }}{% endif %}
      {% endfor -%}

      Result: {{ result_url }}

      ] Template for email body. Used by [email_template: required].

  --token-id=<value>
      APImetrics token to update. Used by [apimetrics_token: required].

  --type=<option>
      (required) Type of webhook to create.
      <options: generic|apimetrics_api|apimetrics_workflow|apimetrics_token|email|email_text|email_template|big_panda|dark
      spark|datadog|datadogevent|flowdock|hipchat|msteams|newrelic|opsgenie|opsgenieeu|pager_duty|pager_duty_v2|slack|stat
      uspage|victorops>

  --url=<value>
      URL for webhook to call. Used by [generic: required, slack: required, hipchat: required, msteams: required].

  --user-key=<value>
      User key to use for authentication. Used by [big_panda: required].

  --username=<value>
      Username to use for authentication. Used by [generic: optional].

  --workflow-id=<value>
      APImetrics workflow to run. Used by [apimetrics_workflow: required].

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a new webhook.

EXAMPLES
  $ apimetrics webhooks create
```

## `apimetrics webhooks delete`

Delete an invite to the project.

```
USAGE
  $ apimetrics webhooks delete --webhook-id <value> [--json] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set.
  --webhook-id=<value>      (required) Webhook to delete.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete an invite to the project.

EXAMPLES
  $ apimetrics webhooks delete --webhook-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

## `apimetrics webhooks edit`

Edit a webhook.

```
USAGE
  $ apimetrics webhooks edit --webhook-id <value> [--json] [-n <value>] [--fails-in-a-row <value>] [--email-address
    <value>] [--subject-template <value>] [--text-template <value>] [--url <value>] [--username <value>] [--password
    <value>] [--call-id <value>] [--workflow-id <value>] [--token-id <value>] [--channel <value>] [--integration-key
    <value>] [--severity critical|error|warning|info] [--user-key <value>] [--app-key <value>] [--api-key <value>]
    [--routing-key <value>] [--page-id <value>] [--component-id <value>] [--flow-token <value>] [--add-alert
    PASS|SLOW|WARNING|FAIL] [--remove-alert PASS|SLOW|WARNING|FAIL] [--add-include-tags <value>] [--remove-include-tags
    <value>] [--add-exclude-tags <value>] [--remove-exclude-tags <value>] [--enable | --disable] [-p <value>]

FLAGS
  -n, --name=<value>
      Name of project.

  -p, --project-id=<value>
      ID of project to read. Overrides apimetrics config project set.

  --add-alert=<option>...
      Add result type to fire webhook on.
      <options: PASS|SLOW|WARNING|FAIL>

  --add-exclude-tags=<value>...
      Add tag to excluded tags.

  --add-include-tags=<value>...
      Add tag to included tags.

  --api-key=<value>
      API key to use for authentication. Used by: [victorops, newrelic, datadog, datadogevent, statuspage, opsgenie,
      opsgenieeu].

  --app-key=<value>
      App key to use to identify this app. Used by [big_panda, newrelic].

  --call-id=<value>
      APImetrics API call to run. Used by [apimetrics_api].

  --channel=<value>
      Integration channel name if different from that defined in the slack integration. Used by [slack].

  --component-id=<value>
      StatusPage component ID. Used by [statuspage].

  --disable
      Disable this webhook if not already disabled.

  --email-address=<value>
      Your email address. Used by [email, email_text, email_template].

  --enable
      Enable this webhook if it is not already enabled

  --fails-in-a-row=<value>
      Trigger webhook after this many successive failures. Used by all except apimetrics_token.

  --flow-token=<value>
      The token for the flow to post to. Used by [flowdock].

  --integration-key=<value>
      The service integration key with Integration Type: APImetrics. Used by [pager_duty, pager_duty_v2].

  --page-id=<value>
      Page ID for StatusPage. Used by [statuspage].

  --password=<value>
      Password to use for authentication. Used by [generic].

  --remove-alert=<option>...
      Remove result type to fire webhook on.
      <options: PASS|SLOW|WARNING|FAIL>

  --remove-exclude-tags=<value>...
      Remove tag from excluded tags.

  --remove-include-tags=<value>...
      Remove tag from included tags.

  --routing-key=<value>
      Routing key to route alert. Used by [victorops].

  --severity=<option>
      Severity of alert. Used by [pager_duty_v2].
      <options: critical|error|warning|info>

  --subject-template=<value>
      [default: [{{result_class}}]: APImetrics: {{ call_meta.name }}] Template for subject line. Used by [email_template].

  --text-template=<value>
      [default: {{ result }}: HTTP {{ http_code }} {{ http_reason }}
      Latency: {{ response_time }} ms
      Size: {{ response_size }} bytes

      Variables:
      {% for key, value in context|dictsort -%}
      - {{ key }}: {% if value is mapping %}...{% else %}{{ value }}{% endif %}
      {% endfor -%}

      Result: {{ result_url }}

      ] Template for email body. Used by [email_template].

  --token-id=<value>
      APImetrics token to update. Used by [apimetrics_token].

  --url=<value>
      URL for webhook to call. Used by [generic, slack, hipchat, msteams].

  --user-key=<value>
      User key to use for authentication. Used by [big_panda].

  --username=<value>
      Username to use for authentication. Used by [generic].

  --webhook-id=<value>
      (required) Webhook to edit.

  --workflow-id=<value>
      APImetrics workflow to run. Used by [apimetrics_workflow].

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Edit a webhook.

EXAMPLES
  $ apimetrics webhooks edit
```

## `apimetrics workflows`

List workflows.

```
USAGE
  $ apimetrics workflows [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set.
  -x, --extended            show extra columns
  --columns=<value>         only show provided columns (comma-separated)
  --csv                     output is csv format [alias: --output=csv]
  --filter=<value>          filter property by partial string matching, ex: name=foo
  --no-header               hide table header from output
  --no-truncate             do not truncate output to fit screen
  --output=<option>         output in a more machine friendly format
                            <options: csv|json|yaml>
  --sort=<value>            property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List workflows.

EXAMPLES
  $ apimetrics workflows
  Name      Description Stop on failure Handle cookies
  ───────── ─────────── ─────────────── ──────────────
  Buy Fruit             false           false
```

_See code: [dist/commands/workflows/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.2/dist/commands/workflows/index.ts)_
<!-- commandsstop -->
