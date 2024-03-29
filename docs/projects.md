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
  $ apimetrics projects [--json] [--columns <value> | -x] [--filter <value>] [--no-header | [--csv |
    --no-truncate]] [--output csv|json|yaml |  | ] [--sort <value>] [-o <value>]

FLAGS
  -o, --org-id=<value>   ID of organization to read. Overrides apimetrics config org set.Can be found on the
                         Organization Settings web page.
  -x, --extended         show extra columns
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
  List all projects in an organisation that the current user has access to.

EXAMPLES
  $ apimetrics projects
   Name       Tags Created
   ────────── ──── ───────────────────────────
   My Project None 2023-07-21T14:11:07.321416Z
```

_See code: [src/commands/projects/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/projects/index.ts)_

## `apimetrics projects accounts`

List users with access to the Project.

```
USAGE
  $ apimetrics projects accounts [--json] [--columns <value> | -x] [--filter <value>] [--no-header | [--csv |
    --no-truncate]] [--output csv|json|yaml |  | ] [--sort <value>] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to delete. Overrides apimetrics config project set. Can be found in the
                            Project Settings web page under the admin section or by using the command `apimetrics
                            projects --columns name,id`.
  -x, --extended            show extra columns
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
  List users with access to the Project.

EXAMPLES
  $ apimetrics projects accounts
  Email             Access Level
  ───────────────── ────────────
  bob@example.com   VIEWER
  alice@example.com OWNER
```

_See code: [src/commands/projects/accounts/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/projects/accounts/index.ts)_

## `apimetrics projects accounts edit`

Edit account access for the Project.

```
USAGE
  $ apimetrics projects accounts edit [--json] [--add-analyst <value>] [--add-editor <value>] [--add-owner <value>]
    [--add-viewer <value>] [-p <value>] [--remove-analyst <value>] [--remove-editor <value>] [--remove-owner <value>]
    [--remove-viewer <value>]

FLAGS
  -p, --project-id=<value>         ID of project to delete. Overrides apimetrics config project set. This must be in the
                                   specified organization. ID an be found in the Project Settings web page under the
                                   admin section or by using the command `apimetrics projects --columns name,id`.
      --add-analyst=<value>...     ID or email of user to add as an analyst. ID can be found in the Accounts section of
                                   the Organization Settings web page or by using the command `apimetrics org accounts
                                   --columns name,id`.
      --add-editor=<value>...      ID or email of user to add as an editor. ID can be found in the Accounts section of
                                   the Organization Settings web page or by using the command `apimetrics org accounts
                                   --columns name,id`.
      --add-owner=<value>...       ID or email of user to add as an owner. ID can be found in the Accounts section of
                                   the Organization Settings web page or by using the command `apimetrics org accounts
                                   --columns name,id`.
      --add-viewer=<value>...      ID or email of user to add as a viewer. ID can be found in the Accounts section of
                                   the Organization Settings web page or by using the command `apimetrics org accounts
                                   --columns name,id`.
      --remove-analyst=<value>...  ID or email of user to remove as an analyst. ID can be found in the Accounts section
                                   of the Organization Settings web page or by using the command `apimetrics org
                                   accounts --columns name,id`.
      --remove-editor=<value>...   ID or email of user to remove as an editor. ID can be found in the Accounts section
                                   of the Organization Settings web page or by using the command `apimetrics org
                                   accounts --columns name,id`.
      --remove-owner=<value>...    ID or email of user to remove as an owner. ID can be found in the Accounts section of
                                   the Organization Settings web page or by using the command `apimetrics org accounts
                                   --columns name,id`.
      --remove-viewer=<value>...   ID or email of user to remove as a viewer. ID can be found in the Accounts section of
                                   the Organization Settings web page or by using the command `apimetrics org accounts
                                   --columns name,id`.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Edit account access for the Project.

EXAMPLES
  $ apimetrics projects accounts edit --add-owner auth0|abcdefghijklmnopqrstuvwx --remove-viewer auth0|zyxwvutsrqponmlkjihgfedc
```

_See code: [src/commands/projects/accounts/edit.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/projects/accounts/edit.ts)_

## `apimetrics projects create`

Create a new project in the Organization.

```
USAGE
  $ apimetrics projects create -n <value> [--json] [--analyst-role <value>] [--analyst-user <value>] [--editor-role
    <value>] [--editor-user <value>] [-o <value>] [--owner-role <value>] [--owner-user <value>] [--viewer-role <value>]
    [--viewer-user <value>]

FLAGS
  -n, --name=<value>             (required) Name of project.
  -o, --org-id=<value>           ID of organization to modify. Overrides apimetrics config org set.
      --analyst-role=<value>...  ID of role to give analyst access. Can be found in the Accounts section of the
                                 Organization Settings web page or by using the command `apimetrics org accounts
                                 --columns name,id`.
      --analyst-user=<value>...  ID of user to give analyst access. Can be found in the Accounts section of the
                                 Organization Settings web page or by using the command `apimetrics org accounts
                                 --columns name,id`.
      --editor-role=<value>...   ID of role to give editor access. This is the name of the role capitalized and with
                                 whitespace replaced by underscores.
      --editor-user=<value>...   ID of user to give editor access. Can be found in the Accounts section of the
                                 Organization Settings web page or by using the command `apimetrics org accounts
                                 --columns name,id`.
      --owner-role=<value>...    ID of role to give owner access. This is the name of the role capitalized and with
                                 whitespace replaced by underscores.
      --owner-user=<value>...    ID of user to give owner access. Can be found in the Accounts section of the
                                 Organization Settings web page or by using the command `apimetrics org accounts
                                 --columns name,id`.
      --viewer-role=<value>...   ID of role to give viewer access. This is the name of the role capitalized and with
                                 whitespace replaced by underscores.
      --viewer-user=<value>...   ID of user to give viewer access.Can be found on the Organization Settings web page.

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

_See code: [src/commands/projects/create.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/projects/create.ts)_

## `apimetrics projects delete`

Delete the currently selected project or specify another to delete.

```
USAGE
  $ apimetrics projects delete [--json] [-o <value>] [-p <value>]

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

_See code: [src/commands/projects/delete.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/projects/delete.ts)_

## `apimetrics projects invites`

List invites in the project.

```
USAGE
  $ apimetrics projects invites [--json] [--columns <value> | -x] [--filter <value>] [--no-header | [--csv |
    --no-truncate]] [--output csv|json|yaml |  | ] [--sort <value>] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set. Can be found in the Project
                            Settings web page under the admin section or by using the command `apimetrics projects
                            --columns name,id`.
  -x, --extended            show extra columns
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
  List invites in the project.

EXAMPLES
  $ apimetrics projects invites
  Email             Access Level Created
  ───────────────── ──────────── ───────────────────────────
  alice@example.com VIEWER       2023-08-03T22:28:02.141461Z
```

_See code: [src/commands/projects/invites/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/projects/invites/index.ts)_

## `apimetrics projects invites create`

Create an invite to the project.

```
USAGE
  $ apimetrics projects invites create --access-level owner|editor|analyst|viewer --email <value> [--json] [-p <value>]

FLAGS
  -p, --project-id=<value>     ID of project to modify. Overrides apimetrics config project set. Can be found in the
                               Project Settings web page under the admin section or by using the command `apimetrics
                               projects --columns name,id`.
      --access-level=<option>  (required) Access level.
                               <options: owner|editor|analyst|viewer>
      --email=<value>          (required) Email to send invite to.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create an invite to the project.

EXAMPLES
  $ apimetrics projects invites create --email alice@example.com --access-level editor
  ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

_See code: [src/commands/projects/invites/create.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/projects/invites/create.ts)_

## `apimetrics projects invites delete`

Delete an invite to the project.

```
USAGE
  $ apimetrics projects invites delete --invite-id <value> [--json]

FLAGS
  --invite-id=<value>  (required) Invite to delete. Can be found in the Diff of the Audit Logs web page for when the
                       invite was created or by using the command `apimetrics projects invites --columns
                       email,roles,id`.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete an invite to the project.

EXAMPLES
  $ apimetrics projects invites delete --invite-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

_See code: [src/commands/projects/invites/delete.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/projects/invites/delete.ts)_

## `apimetrics projects pull`

Fetch project.yaml file.

```
USAGE
  $ apimetrics projects pull [--json] [--environment] [-f -o <value>] [--header] [-p <value>] [--webhook]

FLAGS
  -f, --force               Force overwriting of existing project.yaml file.
  -o, --out=<value>         File to write project.yaml to.
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set. Can be found in the Project
                            Settings web page under the admin section or by using the command `apimetrics projects
                            --columns name,id`.
      --[no-]environment    Include environment variable data.
      --[no-]header         Include header data.
      --[no-]webhook        Include webhook data.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Fetch project.yaml file.

EXAMPLES
  $ apimetrics projects pull --out myproject.yaml
  Wrote project.yaml to myproject.yaml.
```

_See code: [src/commands/projects/pull.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/projects/pull.ts)_

## `apimetrics projects roles`

List all roles with access to the Project.

```
USAGE
  $ apimetrics projects roles [--json] [--columns <value> | -x] [--filter <value>] [--no-header | [--csv |
    --no-truncate]] [--output csv|json|yaml |  | ] [--sort <value>] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set. Can be found in the Project
                            Settings web page under the admin section or by using the command `apimetrics projects
                            --columns name,id`.
  -x, --extended            show extra columns
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

_See code: [src/commands/projects/roles/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/projects/roles/index.ts)_

## `apimetrics projects roles edit`

Edit role access on the project.

```
USAGE
  $ apimetrics projects roles edit [--json] [--add-analyst <value>] [--add-editor <value>] [--add-owner <value>]
    [--add-viewer <value>] [-p <value>] [--remove-analyst <value>] [--remove-editor <value>] [--remove-owner <value>]
    [--remove-viewer <value>]

FLAGS
  -p, --project-id=<value>         ID of project to read. Overrides apimetrics config project set.
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

_See code: [src/commands/projects/roles/edit.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/projects/roles/edit.ts)_
