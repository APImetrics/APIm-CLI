`apimetrics calls`
==================

Manage monitoring calls, which can be separated into two sections:

* API Calls
  * [`apimetrics calls`](#apimetrics-calls)
  * [`apimetrics calls create`](#apimetrics-calls-create)
  * [`apimetrics calls edit`](#apimetrics-calls-edit)\
* Schedules
  * [`apimetrics calls schedules add`](#apimetrics-calls-schedules-add)
  * [`apimetrics calls schedules delete`](#apimetrics-calls-schedules-delete)

## API Calls

### `apimetrics calls`

List all API calls in the Project.

```
USAGE
  $ apimetrics calls [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set.
  -x, --extended            show extra columns.
  --columns=<value>         only show provided columns (comma-separated).
  --csv                     output is csv format [alias: --output=csv].
  --filter=<value>          filter property by partial string matching, ex: name=foo. Value is case-sensitive.
  --no-header               hide table header from output.
  --no-truncate             do not truncate output to fit screen.
  --output=<option>         output in a more machine friendly format.
                            <options: csv|json|yaml>
  --sort=<value>            property to sort by (prepend '-' for descending).

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

_See code: [src/commands/calls/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/calls/index.ts)_

### `apimetrics calls create`

Create a new API call in the Project.

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

_See code: [src/commands/calls/create.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/calls/create.ts)_

### `apimetrics calls edit`

Edit an existing API call. Call IDs can be found in the expanded Audit Logs of the desired API call in the Audit tab or by using the command `apimetrics calls --columns name,id`.

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

_See code: [src/commands/calls/edit.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/calls/edit.ts)_

## Schedules

### `apimetrics calls schedules add`

Add an API call to a Schedule.

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

### `apimetrics calls schedules delete`

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
