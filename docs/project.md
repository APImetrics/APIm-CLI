`apimetrics project`
====================

Fetch project.yaml file

* [`apimetrics project pull`](#apimetrics-project-pull)

## `apimetrics project pull`

Fetch project.yaml file

```
USAGE
  $ apimetrics project pull [--json] [-f -o <value>] [--environment] [--header] [--webhook]

FLAGS
  -f, --force         Force overwriting of existing project.yaml file.
  -o, --out=<value>   File to write project.yaml to.
  --[no-]environment  Include environment variable data
  --[no-]header       Include header data
  --[no-]webhook      Include webhook data

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Fetch project.yaml file

EXAMPLES
  $ apimetrics project pull --key <api key>
```
