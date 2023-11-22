`apimetrics org`
================

Manage organization settings, which can be separated into three sections:

* [Accounts](#accounts)
  * [`apimetrics org accounts`](#apimetrics-org-accounts)
  * [`apimetrics org accounts edit`](#apimetrics-org-accounts-edit)
  * [`apimetrics org accounts remove`](#apimetrics-org-accounts-remove)
* [Invites](#invites)
  * [`apimetrics org invites`](#apimetrics-org-invites)
  * [`apimetrics org invites create`](#apimetrics-org-invites-create)
  * [`apimetrics org invites delete`](#apimetrics-org-invites-delete)
* [Roles](#roles)
  * [`apimetrics org roles`](#apimetrics-org-roles)
  * [`apimetrics org roles create`](#apimetrics-org-roles-create)
  * [`apimetrics org roles delete`](#apimetrics-org-roles-delete)

## Accounts

### `apimetrics org accounts`

List all users within an Organization.

```
USAGE
  $ apimetrics org accounts [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of organization to read. Overrides apimetrics config org set.
  -x, --extended        show extra columns.
  --columns=<value>     only show provided columns (comma-separated).
  --csv                 output is csv format [alias: --output=csv].
  --filter=<value>      filter property by partial string matching, ex: name=foo. Value is case-sensitive.
  --no-header           hide table header from output.
  --no-truncate         do not truncate output to fit screen.
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>.
  --sort=<value>        property to sort by (prepend '-' for descending).

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

  $ apimetrics org accounts --columns=Name,ID
  Name              ID
  ───────────────── ──────────────────────────────
  alice@example.com auth0|abcdefghijklmnopqrstuvwx
  Bob               auth0|zyxwvutsrqponmlkjihgfedc
```

_See code: [src/commands/org/accounts/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/org/accounts/index.ts)_

### `apimetrics org accounts edit`

Edit an account within the Organization. User IDs can be found in the Accounts section of the [Organization Settings](https://docs.apimetrics.io/docs/organizations#accounts).

```
USAGE
  $ apimetrics org accounts edit -u <value> [--json] [--add-role <value>] [--remove-role <value>] [-o <value>]

FLAGS
  -o, --org-id=<value>      ID of organization to modify. Overrides apimetrics config org set.
  -u, --user-id=<value>     (required) ID of user.
  --add-role=<value>...     Add a role to the account.
  --remove-role=<value>...  Name of role to remove.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Edit an account.

EXAMPLES
  $ apimetrics org accounts edit -u auth0|abc123 --add-role ADMIN --remove-role DEV_TEAM
```

_See code: [src/commands/org/accounts/edit.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/org/accounts/edit.ts)_

### `apimetrics org accounts remove`

Remove an account from the Organization. User IDs can be found in the Accounts section of the [Organization Settings](https://docs.apimetrics.io/docs/organizations#accounts).

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

_See code: [src/commands/org/accounts/remove.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/org/accounts/remove.ts)_

## Invites

### `apimetrics org invites`

List all current invites to the Organization.

```
USAGE
  $ apimetrics org invites [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of organization to read. Overrides apimetrics config org set.
  -x, --extended        show extra columns.
  --columns=<value>     only show provided columns (comma-separated).
  --csv                 output is csv format [alias: --output=csv].
  --filter=<value>      filter property by partial string matching, ex: name=foo. Value is case-sensitive.
  --no-header           hide table header from output.
  --no-truncate         do not truncate output to fit screen.
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>.
  --sort=<value>        property to sort by (prepend '-' for descending).

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

_See code: [src/commands/org/invites/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/org/invites/index.ts)_

### `apimetrics org invites create`

Create an invite to the Organization.

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

_See code: [src/commands/org/invites/create.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/org/invites/create.ts)_

### `apimetrics org invites delete`

Delete an invite to the Organization. Invite IDs can be found in the Diff of the [Audit Logs](https://docs.apimetrics.io/docs/organizations#audit-logs) for when the Invite was created.

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

_See code: [src/commands/org/invites/delete.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/org/invites/delete.ts)_

## Roles

### `apimetrics org roles`

List all roles within the Organization.

```
USAGE
  $ apimetrics org roles [--json] [--columns <value> | ] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of organization to read. Overrides apimetrics config org set.
  --columns=<value>     only show provided columns (comma-separated).
  --csv                 output is csv format [alias: --output=csv].
  --filter=<value>      filter property by partial string matching, ex: name=foo. Value is case-sensitive.
  --no-header           hide table header from output.
  --no-truncate         do not truncate output to fit screen.
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>.
  --sort=<value>        property to sort by (prepend '-' for descending).

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

_See code: [src/commands/org/roles/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/org/roles/index.ts)_

### `apimetrics org roles create`

Create a new role within the Organization.

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

_See code: [src/commands/org/roles/create.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/org/roles/create.ts)_

### `apimetrics org roles delete`

Delete a role within the Organization. The Role ID will be the Name of the Role.

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

_See code: [src/commands/org/roles/delete.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/org/roles/delete.ts)_
