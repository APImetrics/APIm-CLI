`apimetrics projects`
=====================

Manage projects

* [`apimetrics projects`](#apimetrics-projects)
* [`apimetrics projects create`](#apimetrics-projects-create)
* [`apimetrics projects invites`](#apimetrics-projects-invites)
* [`apimetrics projects invites create`](#apimetrics-projects-invites-create)
* [`apimetrics projects invites delete`](#apimetrics-projects-invites-delete)
* [`apimetrics projects pull`](#apimetrics-projects-pull)

## `apimetrics projects`

List all projects

```
USAGE
  $ apimetrics projects [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  List all projects

EXAMPLES
  $ apimetrics projects
```

_See code: [dist/commands/projects/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.0/dist/commands/projects/index.ts)_

## `apimetrics projects create`

Create a new project

```
USAGE
  $ apimetrics projects create -n <value> [--json] [--owner <value>] [--editor <value>] [--analyst <value>] [--viewer
    <value>]

FLAGS
  -n, --name=<value>    (required) Name of project
  --analyst=<value>...  Name of role or email of user to give analyst access
  --editor=<value>...   Name of role or email of user to give editor access
  --owner=<value>...    Name of role or email of user to give owner access
  --viewer=<value>...   Name of role or email of user to give viewer access

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a new project

EXAMPLES
  $ apimetrics projects create
```

## `apimetrics projects invites`

List all invites in a project

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
  List all invites in a project

EXAMPLES
  $ apimetrics projects invites
```

## `apimetrics projects invites create`

Create an invite to the project

```
USAGE
  $ apimetrics projects invites create --email <value> --access-level owner|editor|analyst|viewer [--json] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set.
  --access-level=<option>   (required) Access Level
                            <options: owner|editor|analyst|viewer>
  --email=<value>           (required) Email to send invite to

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create an invite to the project

EXAMPLES
  $ apimetrics projects invites create
```

## `apimetrics projects invites delete`

Delete an invite to the project

```
USAGE
  $ apimetrics projects invites delete [--json] [--invite-id <value>] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set.
  --invite-id=<value>       Invite to delete

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete an invite to the project

EXAMPLES
  $ apimetrics projects invites delete
```

## `apimetrics projects pull`

Fetch project.yaml file

```
USAGE
  $ apimetrics projects pull [--json] [-f -o <value>] [--environment] [--header] [--webhook] [-p <value>]

FLAGS
  -f, --force               Force overwriting of existing project.yaml file.
  -o, --out=<value>         File to write project.yaml to.
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set.
  --[no-]environment        Include environment variable data
  --[no-]header             Include header data
  --[no-]webhook            Include webhook data

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Fetch project.yaml file

EXAMPLES
  $ apimetrics projects pull
```
