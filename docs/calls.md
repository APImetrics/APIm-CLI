`apimetrics calls`
==================

Manage monitoring calls

* [`apimetrics calls`](#apimetrics-calls)
* [`apimetrics calls create`](#apimetrics-calls-create)
* [`apimetrics calls edit`](#apimetrics-calls-edit)

## `apimetrics calls`

List all API calls

```
USAGE
  $ apimetrics calls [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  List all API calls

EXAMPLES
  $ apimetrics calls
```

_See code: [dist/commands/calls/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.0/dist/commands/calls/index.ts)_

## `apimetrics calls create`

Create a new API call

```
USAGE
  $ apimetrics calls create -n <value> -u <value> [--json] [-m
    get|GET|head|HEAD|post|POST|put|PUT|patch|PATCH|delete|DELETE|options|OPTIONS] [--accept <value>] [--header <value>]
    [--tag <value>] [-p <value>]

FLAGS
  -m, --method=<option>     [default: GET] HTTP method to use
                            <options: get|GET|head|HEAD|post|POST|put|PUT|patch|PATCH|delete|DELETE|options|OPTIONS>
  -n, --name=<value>        (required) Name of API call
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set.
  -u, --url=<value>         (required) URL to call
  --accept=<value>          MIME type for accept header. Alias for --header Accept: <MIME type>.
  --header=<value>...       Header to add to call.
  --tag=<value>...          Tag to add to call

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a new API call

EXAMPLES
  $ apimetrics calls create
```

## `apimetrics calls edit`

Edit an existing API call

```
USAGE
  $ apimetrics calls edit [--json] [-i <value>] [-n <value>] [-u <value>] [-m
    get|GET|head|HEAD|post|POST|put|PUT|patch|PATCH|delete|DELETE|options|OPTIONS] [--accept <value>] [--add-header
    <value>] [--replace-header <value>] [--remove-header <value>] [--add-tag <value>] [--remove-tag <value>] [-p
    <value>]

FLAGS
  -i, --call-id=<value>        ID of call
  -m, --method=<option>        HTTP method to use
                               <options: get|GET|head|HEAD|post|POST|put|PUT|patch|PATCH|delete|DELETE|options|OPTIONS>
  -n, --name=<value>           Name of API call
  -p, --project-id=<value>     ID of project to modify. Overrides apimetrics config project set.
  -u, --url=<value>            URL to call
  --accept=<value>             MIME type for accept header. Alias for --replace-header Accept: <MIME type>.
  --add-header=<value>...      Add header to the call. Specify in the form <key>: <value>.
  --add-tag=<value>...         Name of tag to add. No effect if the tag already exists.
  --remove-header=<value>...   Name of header to remove.
  --remove-tag=<value>...      Name of tag to remove.
  --replace-header=<value>...  Add header to the call or replace if it already exists. Specify in the form <key>:
                               <value>.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Edit an existing API call

EXAMPLES
  $ apimetrics calls edit
```
