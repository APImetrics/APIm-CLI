`apimetrics info`
=================

Information about APImetrics monitoring infrastructure.

* [`apimetrics info locations`](#apimetrics-info-locations)
* [`apimetrics info orgs`](#apimetrics-info-orgs)
* [`apimetrics info regions`](#apimetrics-info-regions)
* [`apimetrics info whoami`](#apimetrics-info-whoami)

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

_See code: [src/commands/info/locations.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/info/locations.ts)_

## `apimetrics info orgs`

List all Organizations the current user is a member of.

```
USAGE
  $ apimetrics info orgs [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  List all Organizations the current user is a member of.

EXAMPLES
  $ apimetrics info orgs
  Name                         ID        Subscription Level
  ──────────────────────────── ──────── ──────────────────
  Org with Enterprise contract companya CONTRACT
  An Org                       companyb PLAN
```

_See code: [src/commands/info/orgs.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/info/orgs.ts)_

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

_See code: [src/commands/info/regions.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/info/regions.ts)_

## `apimetrics info whoami`

Show details about the currently logged in user.

```
USAGE
  $ apimetrics info whoami [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Show details about the currently logged in user.

EXAMPLES
  $ apimetrics info whoami
  ID:                   auth0|109e70845ef23eb4099c209p
  Name:                 Bob
  Email:                bob@example.com
  MFA enabled:          false
  Current Organization: companya
  Current Project Name: My Project
  Current Project ID:   ag9zfmFwaWasfHJpY3MtclpsEQsSBFVzZyu;gIDgpdG73QoM
```

_See code: [src/commands/info/whoami.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/info/whoami.ts)_
