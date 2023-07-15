`apimetrics org`
================

Manage organisation settings

* [`apimetrics org accounts`](#apimetrics-org-accounts)
* [`apimetrics org invites`](#apimetrics-org-invites)
* [`apimetrics org invites create`](#apimetrics-org-invites-create)
* [`apimetrics org invites delete`](#apimetrics-org-invites-delete)

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

## `apimetrics org invites`

List all invites in an organisation

```
USAGE
  $ apimetrics org invites [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  List all invites in an organisation

EXAMPLES
  $ apimetrics org invites
```

## `apimetrics org invites create`

Create an invite to the organisation

```
USAGE
  $ apimetrics org invites create --email <value> [--json] [--role <value>]

FLAGS
  --email=<value>    (required) Email to send invite to
  --role=<value>...  Users role

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create an invite to the organisation

EXAMPLES
  $ apimetrics org invites create
```

## `apimetrics org invites delete`

Delete an invite to the organisation

```
USAGE
  $ apimetrics org invites delete [--json] [--invite-id <value>]

FLAGS
  --invite-id=<value>  Invite to delete

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete an invite to the organisation

EXAMPLES
  $ apimetrics org invites delete
```
