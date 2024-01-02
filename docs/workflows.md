`apimetrics workflows`
======================

Manage project workflows.

* [`apimetrics workflows`](#apimetrics-workflows)
* [`apimetrics workflows create`](#apimetrics-workflows-create)
* [`apimetrics workflows delete`](#apimetrics-workflows-delete)
* [`apimetrics workflows edit`](#apimetrics-workflows-edit)

## `apimetrics workflows`

List all workflows in the Project.

```
USAGE
  $ apimetrics workflows [--json] [--columns <value> | -x] [--filter <value>] [--no-header | [--csv |
    --no-truncate]] [--output csv|json|yaml |  | ] [--sort <value>] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set. Can be found in the Project
                            Settings web page under the admin section or by using the command `apimetrics projects
                            --columns name,id`.
  -x, --extended            show extra columns
      --columns=<value>     only show provided columns (comma-separated)
      --csv                 output is csv format [alias: --output=csv]
      --filter=<value>      filter property by partial string matching, ex: name=foo
      --no-header           hide table header from output
      --no-truncate         do not truncate output to fit screen
      --output=<option>     output in a more machine friendly format
                            <options: csv|json|yaml>
      --sort=<value>        property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all workflows in the Project.

EXAMPLES
  $ apimetrics workflows
  Name      Description Stop on failure Handle cookies
  ───────── ─────────── ─────────────── ──────────────
  Buy Fruit             false           false
```

_See code: [src/commands/workflows/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/workflows/index.ts)_

## `apimetrics workflows create`

Create a new workflow.

```
USAGE
  $ apimetrics workflows create --name <value> [--json] [--call <value>] [--description <value>] [--handle-cookies]
    [--ignore-in-stats <value>] [--location <value>] [--max-retries <value>] [--parallel] [-p <value>] [--retry-base
    <value>] [--retry-factor <value>] [--retry-interval <value>] [--retry-method fibonacci|exponential|constant|never]
    [--show-as-action] [--skip-notifications <value>] [--stop-on-failure] [--tag <value>]

FLAGS
  -p, --project-id=<value>          ID of project to modify. Overrides apimetrics config project set.
      --call=<value>...             ID of call to add to workflow.
      --description=<value>         Description for this workflow.
      --[no-]handle-cookies         Should cookies be handled?
      --ignore-in-stats=<value>     Number of retries to ignore in failure statistics.
      --location=<value>            Only run calls from this location.
      --max-retries=<value>         Maximum number of retries to attempt.
      --name=<value>                (required) Name for workflow.
      --[no-]parallel               Should parallel execution be allowed?
      --retry-base=<value>          Base for exponential retry.
      --retry-factor=<value>        Factor for exponential retry.
      --retry-interval=<value>      Wait X seconds between each retry.
      --retry-method=<option>       Algorithm for retries.
                                    <options: fibonacci|exponential|constant|never>
      --show-as-action              Show on project home page as action.
      --skip-notifications=<value>  Number of retries to attempt before sending notifications.
      --[no-]stop-on-failure        Should the workflow stop execution on a failed call?
      --tag=<value>...              Tag to add to workflow.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a new workflow.

EXAMPLES
  $ apimetrics workflows create --name="My Workflow"
```

_See code: [src/commands/workflows/create.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/workflows/create.ts)_

## `apimetrics workflows delete`

Delete a workflow.

```
USAGE
  $ apimetrics workflows delete --workflow-id <value> [--json]

FLAGS
  --workflow-id=<value>  (required) Workflow to delete.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete a workflow.

EXAMPLES
  $ apimetrics workflows delete --workflow-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

_See code: [src/commands/workflows/delete.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/workflows/delete.ts)_

## `apimetrics workflows edit`

Edit a workflow.

```
USAGE
  $ apimetrics workflows edit --workflow-id <value> [--json] [--add-call <value>] [--add-tag <value>] [--description
    <value>] [--handle-cookies] [--ignore-in-stats <value>] [--location <value>] [--max-retries <value>] [--name
    <value>] [--no-handle-cookies] [--no-location] [--no-parallel] [--no-show-as-action] [--no-stop-on-failure]
    [--parallel] [--remove-call <value>] [--remove-tag <value>] [--retry] [--retry-base <value>] [--retry-factor
    <value>] [--retry-interval <value>] [--retry-method fibonacci|exponential|constant|never] [--show-as-action]
    [--skip-notifications <value>] [--stop-on-failure]

FLAGS
  --add-call=<value>...         ID and index of call to add in a comma seperated format. To add to end, use index -1.
                                E.g --add-call=abc123,0 to add call abc123 to start.
  --add-tag=<value>...          Tag to add to workflow.
  --description=<value>         Description for this workflow.
  --handle-cookies              Handle cookies
  --ignore-in-stats=<value>     Number of retries to ignore in failure statistics.
  --location=<value>            Only run calls from this location.
  --max-retries=<value>         Maximum number of retries to attempt.
  --name=<value>                Name for workflow.
  --no-handle-cookies           Don't handle cookies
  --no-location                 Do not limit calls to a single location.
  --no-parallel                 Disable parallel execution.
  --no-show-as-action           Don't show on project home page as action.
  --no-stop-on-failure          Don't stop on a failed call.
  --parallel                    Allow parallel execution.
  --remove-call=<value>...      Index of call to remove.
  --remove-tag=<value>...       Tag to remove from workflow.
  --[no-]retry                  Should retry be enabled?
  --retry-base=<value>          Base for exponential retry.
  --retry-factor=<value>        Factor for exponential retry.
  --retry-interval=<value>      Wait X seconds between each retry.
  --retry-method=<option>       Algorithm for retries.
                                <options: fibonacci|exponential|constant|never>
  --show-as-action              Show on project home page as action.
  --skip-notifications=<value>  Number of retries to attempt before sending notifications.
  --stop-on-failure             Stop on a failed call
  --workflow-id=<value>         (required) Workflow to edit.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Edit a workflow.

EXAMPLES
  $ apimetrics workflows edit --workflow-id=ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

_See code: [src/commands/workflows/edit.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/workflows/edit.ts)_
