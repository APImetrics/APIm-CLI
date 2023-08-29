`apimetrics org`
================

Manage organization settings.

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