`apimetrics info`
=================

Information about APImetrics monitoring infrastructure.

* [`apimetrics info locations`](#apimetrics-info-locations)
* [`apimetrics info regions`](#apimetrics-info-regions)

## `apimetrics info locations`

List all available agent locations.

```
USAGE
  $ apimetrics info locations [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  List all available agent locations.

EXAMPLES
  $ apimetrics info locations
  Name                   IP
  ────────────────────── ──────────────
  public_awsuswest       54.191.239.225
  public_azureasiase     13.67.53.204
  public_googleuscentral 35.226.77.27
```

_See code: [src/commands/info/locations.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.1.0/src/commands/info/locations.ts)_

## `apimetrics info regions`

List all available regions.

```
USAGE
  $ apimetrics info regions [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  List all available regions.

EXAMPLES
  $ apimetrics info regions
  Name            ID
  ─────────────── ───
  IBM Cloud       sft
  Europe          eu
  Microsoft Azure azr
  North America   na
```

_See code: [src/commands/info/regions.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.1.0/src/commands/info/regions.ts)_
