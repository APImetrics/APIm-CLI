`apimetrics config`
===================

Manage CLI configuration options.

* [`apimetrics config org set`](#apimetrics-config-org-set)
* [`apimetrics config project set`](#apimetrics-config-project-set)

## `apimetrics config org set`

If you want to change the Organization you are working on while logged in, you will need the ID of the Organization. You can find this in the [Organization Settings](https://docs.apimetrics.io/docs/organizations#organization-settings). Run the following command, replacing abccorp with the Organization ID:

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

If you want to change the Project you are working on while logged in, you will need the ID of the Project. You can find this in the Project Settings under the Admin section. Run the following command, replacing abcproj with the Project ID:

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
