`apimetrics schedules`
======================

Manage project schedules.

* [`apimetrics schedules`](#apimetrics-schedules)
* [`apimetrics schedules calls`](#apimetrics-schedules-calls)
* [`apimetrics schedules calls add`](#apimetrics-schedules-calls-add)
* [`apimetrics schedules calls remove`](#apimetrics-schedules-calls-remove)

## `apimetrics schedules`

List schedules.

```
USAGE
  $ apimetrics schedules [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set.
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
  List schedules.

EXAMPLES
  $ apimetrics schedules
  Name          Frequency        Regions
  ───────────── ──────────────── ───────
  High freq     Every 10 seconds all
  Schedule 2    Every 5 minutes  all, oc
```

_See code: [dist/commands/schedules/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.0.1/dist/commands/schedules/index.ts)_

## `apimetrics schedules calls`

List calls on the schedule.

```
USAGE
  $ apimetrics schedules calls -s <value> [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>   ID of project to read. Overrides apimetrics config project set.
  -s, --schedule-id=<value>  (required) ID of schedule to read.
  -x, --extended             show extra columns
  --columns=<value>          only show provided columns (comma-separated)
  --csv                      output is csv format [alias: --output=csv]
  --filter=<value>           filter property by partial string matching, ex: name=foo
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --output=<option>          output in a more machine friendly format
                             <options: csv|json|yaml>
  --sort=<value>             property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List calls on the schedule.

EXAMPLES
  $ apimetrics schedules calls --schedule-id ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Pbn4ZILDA
  Name   Description Method URL
  ────── ─────────── ────── ──────────────────────────
  Apples             GET    https://example.com/apples
```

## `apimetrics schedules calls add`

Add call to schedule.

```
USAGE
  $ apimetrics schedules calls add -s <value> -c <value> [--json] [-p <value>]

FLAGS
  -c, --call-id=<value>      (required) ID of call to add.
  -p, --project-id=<value>   ID of project to modify. Overrides apimetrics config project set.
  -s, --schedule-id=<value>  (required) ID of schedule to modify.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Add call to schedule.

ALIASES
  $ apimetrics calls schedules add

EXAMPLES
  $ apimetrics schedules calls add --schedule-id ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Pbn4ZILDA --call-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXR1cDIYgIDg9f3DuAoM
```

## `apimetrics schedules calls remove`

Remove call from schedule

```
USAGE
  $ apimetrics schedules calls remove -s <value> -c <value> [--json] [-p <value>]

FLAGS
  -c, --call-id=<value>      (required) ID of call to remove.
  -p, --project-id=<value>   ID of project to modify. Overrides apimetrics config project set.
  -s, --schedule-id=<value>  (required) ID of schedule to modify.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Remove call from schedule

ALIASES
  $ apimetrics calls schedules delete

EXAMPLES
  $ apimetrics schedules calls remove --schedule-id ag9zfmFwaW1ldHJpY3MtcWNyFQsSCFNjaGVkdWxlGICA4Pbn4ZILDA --call-id ag9zfmFwaW1ldHJpY3MtcWNyFwsSClRlc3RTZXRjklafJhslw62dahoM
```
