`apimetrics config`
===================

Manage CLI configuration options.

* [`apimetrics config org set`](#apimetrics-config-org-set)
* [`apimetrics config project set`](#apimetrics-config-project-set)

## `apimetrics config org set`

Set the current working organization.

```
USAGE
  $ apimetrics config org set [--json] [-o <value>]

FLAGS
  -o, --org-id=<value>  ID of org to set to.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Set the current working organization.

EXAMPLES
  $ apimetrics config org set  --org-id abccorp
```

_See code: [src/commands/config/org/set.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/config/org/set.ts)_

## `apimetrics config project set`

Set the current working project

```
USAGE
  $ apimetrics config project set [--json] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to switch to

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Set the current working project

EXAMPLES
  $ apimetrics config project set
```

_See code: [src/commands/config/project/set.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/config/project/set.ts)_
