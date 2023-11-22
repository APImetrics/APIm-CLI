`apimetrics schedules`
======================

Manage project schedules, which can be separated into three sections:

* [Config](#config)
  * [`apimetrics schedules`](#apimetrics-schedules)
  * [`apimetrics schedules create`](#apimetrics-schedules-create)
  * [`apimetrics schedules delete`](#apimetrics-schedules-delete)
  * [`apimetrics schedules edit`](#apimetrics-schedules-edit)
* [API Calls](#api-calls)
  * [`apimetrics schedules calls`](#apimetrics-schedules-calls)
  * [`apimetrics schedules calls add`](#apimetrics-schedules-calls-add)
  * [`apimetrics schedules calls remove`](#apimetrics-schedules-calls-remove)
* [Downtime](#downtime)
  * [`apimetrics schedules downtimes`](#apimetrics-schedules-downtimes)
  * [`apimetrics schedules downtimes create`](#apimetrics-schedules-downtimes-create)
  * [`apimetrics schedules downtimes delete`](#apimetrics-schedules-downtimes-delete)
  * [`apimetrics schedules downtimes edit`](#apimetrics-schedules-downtimes-edit)

## Config

### `apimetrics schedules`

List all Schedules in the Project. **Project IDs** can be found in the Project Settings under the Admin section or by using the command `apimetrics projects -x --no-truncate`.

```
USAGE
  $ apimetrics schedules [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set.
  -x, --extended            show extra columns.
  --columns=<value>         only show provided columns (comma-separated).
  --csv                     output is csv format [alias: --output=csv].
  --filter=<value>          filter property by partial string matching, ex: name=foo. Value is case-sensitive.
  --no-header               hide table header from output.
  --no-truncate             do not truncate output to fit screen.
  --output=<option>         output in a more machine friendly format.
                            <options: csv|json|yaml>
  --sort=<value>            property to sort by (prepend '-' for descending).

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

_See code: [src/commands/schedules/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/schedules/index.ts)_

### `apimetrics schedules create`

Create a new Schedule for the Project. **Project IDs** can be found in the Project Settings under the Admin section or by using the command `apimetrics projects -x --no-truncate`.

```
USAGE
  $ apimetrics schedules create --interval 1m|2m|3m|4m|5m|6m|10m|12m|15m|20m|30m|60m|2h|3h|4h|6h|8h|12h|24h --name
    <value> [--json] [--retry-method fibonacci|exponential|constant] [--retry-base <value>] [--retry-factor <value>]
    [--retry-interval <value>] [--max-retries <value>] [--skip-notifications <value>] [--ignore-in-stats <value>]
    [--postman] [--location <value>] [--region <value>] [-p <value>]

FLAGS
  -p, --project-id=<value>      ID of project to read. Overrides apimetrics config project set.
  --ignore-in-stats=<value>     Number of retries to ignore in failure statistics.
  --interval=<option>           (required) Schedule interval.
                                <options: 1m|2m|3m|4m|5m|6m|10m|12m|15m|20m|30m|60m|2h|3h|4h|6h|8h|12h|24h>
  --location=<value>...         Location to run calls from.
  --max-retries=<value>         Maximum number of retries to attempt.
  --name=<value>                (required) Name of schedule.
  --postman                     Only enable if you use the Postman Monitoring feature.
  --region=<value>...           Region to run calls from.
  --retry-base=<value>          Base for exponential retry.
  --retry-factor=<value>        Factor for exponential retry.
  --retry-interval=<value>      Wait X seconds between each retry.
  --retry-method=<option>       Algorithm for retries.
                                <options: fibonacci|exponential|constant>
  --skip-notifications=<value>  Number of retries to attempt before sending notifications.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create schedule.

EXAMPLES
  $ apimetrics schedules create --name "My Schedule" --interval 5m
  ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

_See code: [src/commands/schedules/create.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/schedules/create.ts)_

### `apimetrics schedules delete`

Delete a Schedule from the Project. **Schedule IDs** can be found by using the command `apimetrics schedules -x --no-truncate`. **Project IDs** can be found in the Project Settings under the Admin section or by using the command `apimetrics projects -x --no-truncate`. 

```
USAGE
  $ apimetrics schedules delete --schedule-id <value> [--json] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set.
  --schedule-id=<value>     (required) Schedule to delete.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete a schedule.

EXAMPLES
  $ apimetrics schedules delete --schedule-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

_See code: [src/commands/schedules/delete.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/schedules/delete.ts)_

### `apimetrics schedules edit`

Edit an existing schedule. **Schedule IDs** can be found by using the command `apimetrics schedules -x --no-truncate`. **Project IDs** can be found in the Project Settings under the Admin section or by using the command `apimetrics projects -x --no-truncate`.

```
USAGE
  $ apimetrics schedules edit --schedule-id <value> [--json] [--interval
    1m|2m|3m|4m|5m|6m|10m|12m|15m|20m|30m|60m|2h|3h|4h|6h|8h|12h|24h] [--name <value>] [--retry-method
    fibonacci|exponential|constant] [--retry] [--retry-base <value>] [--retry-factor <value>] [--retry-interval <value>]
    [--max-retries <value>] [--skip-notifications <value>] [--ignore-in-stats <value>] [--postman] [--no-postman]
    [--add-location <value>] [--remove-location <value>] [--add-region <value>] [--remove-region <value>] [-p <value>]

FLAGS
  -p, --project-id=<value>      ID of project to read. Overrides apimetrics config project set.
  --add-location=<value>...     Add location to run calls from.
  --add-region=<value>...       Add region to run calls from.
  --ignore-in-stats=<value>     Number of retries to ignore in failure statistics.
  --interval=<option>           Schedule interval.
                                <options: 1m|2m|3m|4m|5m|6m|10m|12m|15m|20m|30m|60m|2h|3h|4h|6h|8h|12h|24h>
  --max-retries=<value>         Maximum number of retries to attempt.
  --name=<value>                Name of schedule.
  --no-postman                  Disable the Postman Monitoring feature
  --postman                     Only enable if you use the Postman Monitoring feature
  --remove-location=<value>...  Remove location to run calls from.
  --remove-region=<value>...    Remove region to run calls from.
  --[no-]retry                  Should retry be enabled?
  --retry-base=<value>          Base for exponential retry.
  --retry-factor=<value>        Factor for exponential retry.
  --retry-interval=<value>      Wait X seconds between each retry.
  --retry-method=<option>       Algorithm for retries.
                                <options: fibonacci|exponential|constant>
  --schedule-id=<value>         (required) Schedule to edit.
  --skip-notifications=<value>  Number of retries to attempt before sending notifications.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create schedule.

EXAMPLES
  $ apimetrics schedules edit --name "My Schedule" --interval 5m
  ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

_See code: [src/commands/schedules/edit.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/schedules/edit.ts)_

## API Calls

### `apimetrics schedules calls`

List all the API calls in the Schedule. **Schedule IDs** can be found by using the command `apimetrics schedules -x --no-truncate`. **Project IDs** can be found in the Project Settings under the Admin section or by using the command `apimetrics projects -x --no-truncate`.

```
USAGE
  $ apimetrics schedules calls -s <value> [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>   ID of project to read. Overrides apimetrics config project set.
  -s, --schedule-id=<value>  (required) ID of schedule to read.
  -x, --extended             show extra columns.
  --columns=<value>          only show provided columns (comma-separated).
  --csv                      output is csv format [alias: --output=csv].
  --filter=<value>           filter property by partial string matching, ex: name=foo. Value is case-sensitive.
  --no-header                hide table header from output.
  --no-truncate              do not truncate output to fit screen.
  --output=<option>          output in a more machine friendly format.
                             <options: csv|json|yaml>
  --sort=<value>             property to sort by (prepend '-' for descending).

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

_See code: [src/commands/schedules/calls/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/schedules/calls/index.ts)_

### `apimetrics schedules calls add`

Add call to the Schedule. **Call IDs** can be found in the expanded Audit Logs of the desired API call in the Audit tab or by using the command `apimetrics calls --columns name,id`. **Schedule IDs** can be found by using the command `apimetrics schedules -x --no-truncate`. **Project IDs** can be found in the Project Settings under the Admin section or by using the command `apimetrics projects -x --no-truncate`.

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

_See code: [src/commands/schedules/calls/add.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/schedules/calls/add.ts)_

### `apimetrics schedules calls remove`

Remove an API call from the Schedule. **Call IDs** can be found in the expanded Audit Logs of the desired API call in the Audit tab or by using the command `apimetrics calls --columns name,id`. **Schedule IDs** can be found by using the command `apimetrics schedules -x --no-truncate`. **Project IDs** can be found in the Project Settings under the Admin section or by using the command `apimetrics projects -x --no-truncate`.

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

_See code: [src/commands/schedules/calls/remove.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/schedules/calls/remove.ts)_

## Downtime

### `apimetrics schedules downtimes`

List downtimes for all Schedules. **Project IDs** can be found in the Project Settings under the Admin section or by using the command `apimetrics projects -x --no-truncate`.

```
USAGE
  $ apimetrics schedules downtimes [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  List downtimes.

EXAMPLES
  $ apimetrics schedules downtimes
  ID           Schedule ID  Start                       End                         Repeat
  ──────────── ──────────── ─────────────────────────── ─────────────────────────── ──────
  ag9zfmFwaW1… ag9zfmFwaW1… 2023-09-29T14:54:41.865000Z 2023-09-30T14:54:41.865000Z never
  ag9zfmFwaW1… ag9zfmFwaW1… 2023-09-29T14:57:39.134000Z 2023-10-20T14:57:39.134000Z daily
```

_See code: [src/commands/schedules/downtimes/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/schedules/downtimes/index.ts)_

### `apimetrics schedules downtimes create`

Create downtime for a Schedule. **Schedule IDs** can be found by using the command `apimetrics schedules -x --no-truncate`. **Project IDs** can be found in the Project Settings under the Admin section or by using the command `apimetrics projects -x --no-truncate`.

```
USAGE
  $ apimetrics schedules downtimes create --start <value> --end <value> --schedule-id <value> [--json] [--repeat daily|weekly]
    [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set.
  --end=<value>             (required) Date and time to end downtime in Date Time format (YYYY-MM-DDTHH:mm:ss.sssZ).
  --repeat=<option>         Repeat this downtime at the set interval.
                            <options: daily|weekly>
  --schedule-id=<value>     (required) ID of schedule to add downtime to.
  --start=<value>           (required) Date and time to start downtime in Date Time format (YYYY-MM-DDTHH:mm:ss.sssZ).

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create downtime.

EXAMPLES
  $ apimetrics schedules downtimes create --schedule-id pPbCtcWNyMwsSDU --start 2023-07-21T18:32:00Z --end 2023-07-21T19:32:00Z
  ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

_See code: [src/commands/schedules/downtimes/create.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/schedules/downtimes/create.ts)_

### `apimetrics schedules downtimes delete`

Delete downtime from a Schedule. **Downtime IDs** can be found by using the command `apimetrics schedules downtimes`. **Project IDs** can be found in the Project Settings under the Admin section or by using the command `apimetrics projects -x --no-truncate`.

```
USAGE
  $ apimetrics schedules downtimes delete --downtime-id <value> [--json] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set.
  --downtime-id=<value>     (required) Downtime to delete.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete a downtime.

EXAMPLES
  $ apimetrics schedules downtimes delete --downtime-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

_See code: [src/commands/schedules/downtimes/delete.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/schedules/downtimes/delete.ts)_

### `apimetrics schedules downtimes edit`

Edit downtime for a Schedule. **Downtime IDs** can be found by using the command `apimetrics schedules downtimes`. **Project IDs** can be found in the Project Settings under the Admin section or by using the command `apimetrics projects -x --no-truncate`.

```
USAGE
  $ apimetrics schedules downtimes edit --downtime-id <value> [--json] [--start <value>] [--end <value>] [--repeat
    daily|weekly|off] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set.
  --downtime-id=<value>     (required) ID of downtime to edit.
  --end=<value>             Date and time to end downtime in Date Time format (YYYY-MM-DDTHH:mm:ss.sssZ).
  --repeat=<option>         Repeat this downtime at the set interval.
                            <options: daily|weekly|off>
  --start=<value>           Date and time to start downtime in Date Time format (YYYY-MM-DDTHH:mm:ss.sssZ).

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Edit downtime.

EXAMPLES
  $ apimetrics schedules downtimes edit --downtime-id pPbCtcWNyMwsSDU --start 2023-07-21T18:32:00Z --end 2023-07-21T19:32:00Z
```

_See code: [src/commands/schedules/downtimes/edit.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/schedules/downtimes/edit.ts)_
