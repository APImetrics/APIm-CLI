`apimetrics projects`
=====================

Manage projects.

* [`apimetrics projects`](#apimetrics-projects)
* [`apimetrics projects accounts`](#apimetrics-projects-accounts)
* [`apimetrics projects accounts edit`](#apimetrics-projects-accounts-edit)
* [`apimetrics projects create`](#apimetrics-projects-create)
* [`apimetrics projects delete`](#apimetrics-projects-delete)
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
  -o, --org-id=<value>  ID of organization to read. Overrides apimetrics config org set.Can be found on the Organization
                        Settings web page.
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

_See code: [src/commands/projects/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/projects/index.ts)_

## `apimetrics projects accounts`

List users with access to the Project.

```
USAGE
  $ apimetrics projects accounts [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to delete. Overrides apimetrics config project set. Can be found in the
                            Project Settings web page under the admin section or by using the command `apimetrics
                            projects --columns name,id`.
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
  List users with access to the Project.

EXAMPLES
  $ apimetrics projects accounts
  Email             Access Level
  ───────────────── ────────────
  bob@example.com   VIEWER
  alice@example.com OWNER
```

_See code: [src/commands/projects/accounts/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/projects/accounts/index.ts)_

## `apimetrics projects accounts edit`

Edit account access for the Project.

```
USAGE
  $ apimetrics projects accounts edit [--json] [--add-owner <value>] [--remove-owner <value>] [--add-editor <value>]
    [--remove-editor <value>] [--add-analyst <value>] [--remove-analyst <value>] [--add-viewer <value>] [--remove-viewer
    <value>] [-p <value>]

FLAGS
  -p, --project-id=<value>     ID of project to delete. Overrides apimetrics config project set. Can be found in the
                               Project Settings web page under the admin section or by using the command `apimetrics
                               projects --columns name,id`.
  --add-analyst=<value>...     ID of user to add as an analyst. Can be found in the Accounts section of the Organization
                               Settings web page or by using the command `apimetrics org accounts --columns name,id`.
  --add-editor=<value>...      ID of user to add as an editor. Can be found in the Accounts section of the Organization
                               Settings web page or by using the command `apimetrics org accounts --columns name,id`.
  --add-owner=<value>...       ID of user to add as an owner. Can be found in the Accounts section of the Organization
                               Settings web page or by using the command `apimetrics org accounts --columns name,id`.
  --add-viewer=<value>...      ID of user to add as a viewer. Can be found in the Accounts section of the Organization
                               Settings web page or by using the command `apimetrics org accounts --columns name,id`.
  --remove-analyst=<value>...  ID of user to remove as an analyst. Can be found in the Accounts section of the
                               Organization Settings web page or by using the command `apimetrics org accounts --columns
                               name,id`.
  --remove-editor=<value>...   ID of user to remove as an editor. Can be found in the Accounts section of the
                               Organization Settings web page or by using the command `apimetrics org accounts --columns
                               name,id`.
  --remove-owner=<value>...    ID of user to remove as an owner. Can be found in the Accounts section of the
                               Organization Settings web page or by using the command `apimetrics org accounts --columns
                               name,id`.
  --remove-viewer=<value>...   ID of user to remove as a viewer. Can be found in the Accounts section of the
                               Organization Settings web page or by using the command `apimetrics org accounts --columns
                               name,id`.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Edit account access for the Project.

EXAMPLES
  $ apimetrics projects accounts edit --add-owner auth0|abcdefghijklmnopqrstuvwx --remove-viewer auth0|zyxwvutsrqponmlkjihgfedc
```

_See code: [src/commands/projects/accounts/edit.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/projects/accounts/edit.ts)_

## `apimetrics projects create`

Create a new project in the Organization.

```
USAGE
  $ apimetrics projects create -n <value> [--json] [--owner-user <value>] [--owner-role <value>] [--editor-user
    <value>] [--editor-role <value>] [--analyst-user <value>] [--analyst-role <value>] [--viewer-user <value>]
    [--viewer-role <value>] [-o <value>]

FLAGS
  -n, --name=<value>         (required) Name of project.
  -o, --org-id=<value>       ID of organization to modify. Overrides apimetrics config org set.Can be found on the
                             Organization Settings web page.
  --analyst-role=<value>...  ID of role to give analyst access. This is the name of the role capitalized and with
                             whitespace replaced by underscores.
  --analyst-user=<value>...  ID of user to give analyst access. Can be found in the Accounts section of the Organization
                             Settings web page or by using the command `apimetrics org accounts --columns name,id`.
  --editor-role=<value>...   ID of role to give editor access. This is the name of the role capitalized and with
                             whitespace replaced by underscores.
  --editor-user=<value>...   ID of user to give editor access. Can be found in the Accounts section of the Organization
                             Settings web page or by using the command `apimetrics org accounts --columns name,id`.
  --owner-role=<value>...    ID of role to give owner access. This is the name of the role capitalized and with
                             whitespace replaced by underscores.
  --owner-user=<value>...    ID of user to give owner access. Can be found in the Accounts section of the Organization
                             Settings web page or by using the command `apimetrics org accounts --columns name,id`.
  --viewer-role=<value>...   ID of role to give viewer access. This is the name of the role capitalized and with
                             whitespace replaced by underscores.
  --viewer-user=<value>...   ID of user to give viewer access. Can be found in the Accounts section of the Organization
                             Settings web page or by using the command `apimetrics org accounts --columns name,id`.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a new project in the Organization.

EXAMPLES
  $ apimetrics projects create --name "My Project"
  ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDgtdTd3QkM

  $ apimetrics projects create --name "My Project" --owner-role ADMIN --viewer-user "auth0|abcdefghijklmnopqrstuvwx"
  ag9zfmFwaW1ldHJpY3MtcWNyEQsSBFVzZXIYgIDgtj9TyQkM
```

_See code: [src/commands/projects/create.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/projects/create.ts)_

## `apimetrics projects delete`

Delete the currently selected project or specify another to delete.

```
USAGE
  $ apimetrics projects delete [--json] [-p <value>] [-o <value>]

FLAGS
  -o, --org-id=<value>      ID of organization to modify. Overrides apimetrics config org set.Can be found on the
                            Organization Settings web page.
  -p, --project-id=<value>  ID of project to delete. Overrides apimetrics config project set. Can be found in the
                            Project Settings web page under the admin section or by using the command `apimetrics
                            projects --columns name,id`.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete the currently selected project or specify another to delete.

EXAMPLES
  $ apimetrics projects delete

  $ apimetrics projects delete --project-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

_See code: [src/commands/projects/delete.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/projects/delete.ts)_

## `apimetrics projects invites`

List invites in the project.

```
USAGE
  $ apimetrics projects invites [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set. Can be found in the Project
                            Settings web page under the admin section or by using the command `apimetrics projects
                            --columns name,id`.
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

_See code: [src/commands/projects/invites/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/projects/invites/index.ts)_

## `apimetrics projects invites create`

Create an invite to the project.

```
USAGE
  $ apimetrics projects invites create --email <value> --access-level owner|editor|analyst|viewer [--json] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set. Can be found in the
                            Project Settings web page under the admin section or by using the command `apimetrics
                            projects --columns name,id`.
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

_See code: [src/commands/projects/invites/create.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/projects/invites/create.ts)_

## `apimetrics projects invites delete`

Delete an invite to the project.

```
USAGE
  $ apimetrics projects invites delete --invite-id <value> [--json] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set. Can be found in the
                            Project Settings web page under the admin section or by using the command `apimetrics
                            projects --columns name,id`.
  --invite-id=<value>       (required) Invite to delete. Can be found in the Diff of the Audit Logs web page for when
                            the invite was created or by using the command `apimetrics projects invites --columns
                            email,roles,id`.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete an invite to the project.

EXAMPLES
  $ apimetrics projects invites delete --invite-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

_See code: [src/commands/projects/invites/delete.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/projects/invites/delete.ts)_

## `apimetrics projects pull`

Fetch project.yaml file.

```
USAGE
  $ apimetrics projects pull [--json] [-f -o <value>] [--environment] [--header] [--webhook] [-p <value>]

FLAGS
  -f, --force               Force overwriting of existing project.yaml file.
  -o, --out=<value>         File to write project.yaml to.
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set. Can be found in the Project
                            Settings web page under the admin section or by using the command `apimetrics projects
                            --columns name,id`.
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

_See code: [src/commands/projects/pull.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/projects/pull.ts)_

## `apimetrics projects roles`

List all roles with access to the Project.

```
USAGE
  $ apimetrics projects roles [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set. Can be found in the Project
                            Settings web page under the admin section or by using the command `apimetrics projects
                            --columns name,id`.
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
  List all roles with access to the Project.

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

_See code: [src/commands/projects/roles/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/projects/roles/index.ts)_

## `apimetrics projects roles edit`

Edit role access on the project.

```
USAGE
  $ apimetrics projects roles edit [--json] [--add-owner <value>] [--remove-owner <value>] [--add-editor <value>]
    [--remove-editor <value>] [--add-analyst <value>] [--remove-analyst <value>] [--add-viewer <value>] [--remove-viewer
    <value>] [-p <value>]

FLAGS
  -p, --project-id=<value>     ID of project to modify. Overrides apimetrics config project set. Can be found in the
                               Project Settings web page under the admin section or by using the command `apimetrics
                               projects --columns name,id`.
  --add-analyst=<value>...     ID of role to add as an analyst. This is the name of the role capitalized and with
                               whitespace replaced by underscores.
  --add-editor=<value>...      ID of role to add as an editor. This is the name of the role capitalized and with
                               whitespace replaced by underscores.
  --add-owner=<value>...       ID of role to add as an owner. This is the name of the role capitalized and with
                               whitespace replaced by underscores.
  --add-viewer=<value>...      ID of role to add as a viewer. This is the name of the role capitalized and with
                               whitespace replaced by underscores.
  --remove-analyst=<value>...  ID of role to remove as an analyst. This is the name of the role capitalized and with
                               whitespace replaced by underscores.
  --remove-editor=<value>...   ID of role to remove as an editor. This is the name of the role capitalized and with
                               whitespace replaced by underscores.
  --remove-owner=<value>...    ID of role to remove as an owner. This is the name of the role capitalized and with
                               whitespace replaced by underscores.
  --remove-viewer=<value>...   ID of role to add as a viewer. This is the name of the role capitalized and with
                               whitespace replaced by underscores.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Edit role access on the project.

EXAMPLES
  $ apimetrics projects roles edit --add-owner ADMIN --remove-editor DEBUG
```

_See code: [src/commands/projects/roles/edit.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/projects/roles/edit.ts)_
