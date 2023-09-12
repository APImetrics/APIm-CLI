`apimetrics projects`
=====================

Manage projects.

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

_See code: [dist/commands/projects/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.1/dist/commands/projects/index.ts)_

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
