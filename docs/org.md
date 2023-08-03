`apimetrics org`
================

Manage organization settings

* [`apimetrics org accounts`](#apimetrics-org-accounts)
* [`apimetrics org accounts edit`](#apimetrics-org-accounts-edit)
* [`apimetrics org accounts remove`](#apimetrics-org-accounts-remove)
* [`apimetrics org invites`](#apimetrics-org-invites)
* [`apimetrics org invites create`](#apimetrics-org-invites-create)
* [`apimetrics org invites delete`](#apimetrics-org-invites-delete)
* [`apimetrics org roles`](#apimetrics-org-roles)
* [`apimetrics org roles create`](#apimetrics-org-roles-create)
* [`apimetrics org roles delete`](#apimetrics-org-roles-delete)

## `apimetrics org accounts`

List all users in organization

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
  List all users in organization

EXAMPLES
  $ apimetrics org accounts
```

## `apimetrics org accounts edit`

Edit an account

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
  Edit an account

EXAMPLES
  $ apimetrics org accounts edit
```

## `apimetrics org accounts remove`

Remove an account

```
USAGE
  $ apimetrics org accounts remove -u <value> [--json] [-o <value>]

FLAGS
  -o, --org-id=<value>   ID of organization to modify. Overrides apimetrics config org set.
  -u, --user-id=<value>  (required) ID of user

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Remove an account

EXAMPLES
  $ apimetrics org accounts remove
```

## `apimetrics org invites`

List all invites in an organization

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
  List all invites in an organization

EXAMPLES
  $ apimetrics org invites
```

## `apimetrics org invites create`

Create an invite to the organization

```
USAGE
  $ apimetrics org invites create --email <value> [--json] [--role <value>] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of organization to modify. Overrides apimetrics config org set.
  --email=<value>       (required) Email to send invite to
  --role=<value>...     Users role

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create an invite to the organization

EXAMPLES
  $ apimetrics org invites create
```

## `apimetrics org invites delete`

Delete an invite to the organization

```
USAGE
  $ apimetrics org invites delete [--json] [--invite-id <value>] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of organization to modify. Overrides apimetrics config org set.
  --invite-id=<value>   Invite to delete

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete an invite to the organization

EXAMPLES
  $ apimetrics org invites delete
```

## `apimetrics org roles`

List all roles in an organization

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
  List all roles in an organization

EXAMPLES
  $ apimetrics org roles
```

## `apimetrics org roles create`

Create a role in the organization

```
USAGE
  $ apimetrics org roles create -n <value> -d <value> [--json] [-o <value>]

FLAGS
  -d, --description=<value>  (required) Role description
  -n, --name=<value>         (required) Name of role
  -o, --org-id=<value>       ID of organization to modify. Overrides apimetrics config org set.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a role in the organization

EXAMPLES
  $ apimetrics org roles create
```

## `apimetrics org roles delete`

Delete a role in the organization

```
USAGE
  $ apimetrics org roles delete [--json] [-r <value>] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of organization to modify. Overrides apimetrics config org set.
  -r, --role=<value>    Role to delete

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete a role in the organization

EXAMPLES
  $ apimetrics org roles delete
```
