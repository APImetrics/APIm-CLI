`apimetrics schedules`
======================

Manage project schedules

* [`apimetrics schedules`](#apimetrics-schedules)

## `apimetrics schedules`

List all schedules

```
USAGE
  $ apimetrics schedules [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  List all schedules

EXAMPLES
  $ apimetrics schedules
```

_See code: [dist/commands/schedules/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.0/dist/commands/schedules/index.ts)_
