`apimetrics workflows`
======================

Manage project workflows

* [`apimetrics workflows`](#apimetrics-workflows)

## `apimetrics workflows`

List all workflows

```
USAGE
  $ apimetrics workflows [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  List all workflows

EXAMPLES
  $ apimetrics workflows
```

_See code: [dist/commands/workflows/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.0/dist/commands/workflows/index.ts)_
