`apimetrics project`
====================

Fetch project.yaml file

* [`apimetrics project pull`](#apimetrics-project-pull)

## `apimetrics project pull`

Fetch project.yaml file

```
USAGE
  $ apimetrics project pull [--json] [-f -o <value>] [--environment] [--header] [--webhook] [-p <value>]

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
  $ apimetrics project pull --key <api key>
```
