`apimetrics webhooks`
=====================

Manage project webhooks and alerts.

* [`apimetrics webhooks`](#apimetrics-webhooks)
* [`apimetrics webhooks create`](#apimetrics-webhooks-create)
* [`apimetrics webhooks delete`](#apimetrics-webhooks-delete)
* [`apimetrics webhooks edit`](#apimetrics-webhooks-edit)

## `apimetrics webhooks`

List all webhooks in a Project.

```
USAGE
  $ apimetrics webhooks [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to read. Overrides apimetrics config project set. Can be found in the Project
                            Settings web page under the admin section or by using the command `apimetrics projects
                            --columns name,id`.
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
  List all webhooks in a Project.

EXAMPLES
  $ apimetrics webhooks
  Name         Type      Enabled Include Tags Exclude Tags
  ──────────── ───────── ─────── ──────────── ────────────
  Email        email     true    None         None
  DataDoggg    datadog   false   None         None
  Slack        slack     true    None         None
  GEn          generic   false   None         None
```

_See code: [src/commands/webhooks/index.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/webhooks/index.ts)_

## `apimetrics webhooks create`

Create a new webhook.

```
USAGE
  $ apimetrics webhooks create -n <value> --type
    generic|apimetrics_api|apimetrics_workflow|apimetrics_token|email|email_text|email_template|big_panda|darkspark|data
    dog|datadogevent|flowdock|hipchat|msteams|newrelic|opsgenie|opsgenieeu|pager_duty|pager_duty_v2|slack|statuspage|vic
    torops --alert PASS|SLOW|WARNING|FAIL [--json] [--fails-in-a-row <value>] [--email-address <value>]
    [--subject-template <value>] [--text-template <value>] [--url <value>] [--username <value>] [--password <value>]
    [--call-id <value>] [--workflow-id <value>] [--token-id <value>] [--channel <value>] [--integration-key <value>]
    [--severity critical|error|warning|info] [--user-key <value>] [--app-key <value>] [--api-key <value>] [--routing-key
    <value>] [--page-id <value>] [--component-id <value>] [--flow-token <value>] [--include-tags <value>]
    [--exclude-tags <value>] [-p <value>]

FLAGS
  -n, --name=<value>
      (required) Name of project.

  -p, --project-id=<value>
      ID of project to modify. Overrides apimetrics config project set. Can be found in the Project Settings web page
      under the admin section or by using the command `apimetrics projects --columns name,id`.

  --alert=<option>...
      (required) Fire webhook on these result types.
      <options: PASS|SLOW|WARNING|FAIL>

  --api-key=<value>
      API key to use for authentication. Used by: [victorops: required, newrelic: required, datadog: required,
      datadogevent: required, statuspage: required, opsgenie: required, opsgenieeu: required].

  --app-key=<value>
      App key to use to identify this app. Used by [big_panda: required, newrelic: required].

  --call-id=<value>
      APImetrics API call to run. Can be found in the expanded Audit Logs of the desired API call in the Audit tab web
      page or by using the command `apimetrics calls --columns name,id`. Used by [apimetrics_api: required].

  --channel=<value>
      Integration channel name if different from that defined in the slack integration. Used by [slack: optional].

  --component-id=<value>
      StatusPage component ID. Used by [statuspage: required].

  --email-address=<value>
      Your email address. Used by [email: required, email_text: required, email_template: required].

  --exclude-tags=<value>...
      Exclude calls with this tag.

  --fails-in-a-row=<value>
      Trigger webhook after this many successive failures. Used by all except apimetrics_token.

  --flow-token=<value>
      The token for the flow to post to. Used by [flowdock: required].

  --include-tags=<value>...
      Include calls with this tag.

  --integration-key=<value>
      The service integration key with Integration Type: APImetrics. Used by [pager_duty: required, pager_duty_v2:
      required].

  --page-id=<value>
      Page ID for StatusPage. Used by [statuspage: required].

  --password=<value>
      Password to use for authentication. Used by [generic: optional].

  --routing-key=<value>
      Routing key to route alert. Used by [victorops: optional].

  --severity=<option>
      Severity of alert. Used by [pager_duty_v2: optional].
      <options: critical|error|warning|info>

  --subject-template=<value>
      [default: [{{result_class}}]: APImetrics: {{ call_meta.name }}] Template for subject line. Used by [email_template:
      required].

  --text-template=<value>
      [default: {{ result }}: HTTP {{ http_code }} {{ http_reason }}
      Latency: {{ response_time }} ms
      Size: {{ response_size }} bytes

      Variables:
      {% for key, value in context|dictsort -%}
      - {{ key }}: {% if value is mapping %}...{% else %}{{ value }}{% endif %}
      {% endfor -%}

      Result: {{ result_url }}

      ] Template for email body. Used by [email_template: required].

  --token-id=<value>
      APImetrics token to update. Can be found on the Auth & Tokens web page, select the desired token to see the ID. Used
      by [apimetrics_token: required].

  --type=<option>
      (required) Type of webhook to create.
      <options: generic|apimetrics_api|apimetrics_workflow|apimetrics_token|email|email_text|email_template|big_panda|dark
      spark|datadog|datadogevent|flowdock|hipchat|msteams|newrelic|opsgenie|opsgenieeu|pager_duty|pager_duty_v2|slack|stat
      uspage|victorops>

  --url=<value>
      URL for webhook to call. Used by [generic: required, slack: required, hipchat: required, msteams: required].

  --user-key=<value>
      User key to use for authentication. Used by [big_panda: required].

  --username=<value>
      Username to use for authentication. Used by [generic: optional].

  --workflow-id=<value>
      APImetrics workflow to run. Can be found by using the command `apimetrics workflows --columns name,id`. Used by
      [apimetrics_workflow: required].

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a new webhook.

EXAMPLES
  $ apimetrics webhooks create
```

_See code: [src/commands/webhooks/create.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/webhooks/create.ts)_

## `apimetrics webhooks delete`

Delete a webhook.

```
USAGE
  $ apimetrics webhooks delete --webhook-id <value> [--json] [-p <value>]

FLAGS
  -p, --project-id=<value>  ID of project to modify. Overrides apimetrics config project set. Can be found in the
                            Project Settings web page under the admin section or by using the command `apimetrics
                            projects --columns name,id`.
  --webhook-id=<value>      (required) Webhook to delete. Can be found using the command `apimetrics webhooks --columns
                            name,id`.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete a webhook.

EXAMPLES
  $ apimetrics webhooks delete --webhook-id ag9zfmFwaW1ldHlpPbCtcWNyMwsSDUFjY29lpo95kAab4GUiIHpYSTQxY2JEajkzcWRFbE5GTEVajkuY85RT7jdteFdmDA
```

_See code: [src/commands/webhooks/delete.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/webhooks/delete.ts)_

## `apimetrics webhooks edit`

Edit a webhook.

```
USAGE
  $ apimetrics webhooks edit --webhook-id <value> [--json] [-n <value>] [--fails-in-a-row <value>] [--email-address
    <value>] [--subject-template <value>] [--text-template <value>] [--url <value>] [--username <value>] [--password
    <value>] [--call-id <value>] [--workflow-id <value>] [--token-id <value>] [--channel <value>] [--integration-key
    <value>] [--severity critical|error|warning|info] [--user-key <value>] [--app-key <value>] [--api-key <value>]
    [--routing-key <value>] [--page-id <value>] [--component-id <value>] [--flow-token <value>] [--add-alert
    PASS|SLOW|WARNING|FAIL] [--remove-alert PASS|SLOW|WARNING|FAIL] [--add-include-tags <value>] [--remove-include-tags
    <value>] [--add-exclude-tags <value>] [--remove-exclude-tags <value>] [--enable | --disable] [-p <value>]

FLAGS
  -n, --name=<value>
      Name of project.

  -p, --project-id=<value>
      ID of project to modify. Overrides apimetrics config project set. Can be found in the Project Settings web page
      under the admin section or by using the command `apimetrics projects --columns name,id`.

  --add-alert=<option>...
      Add result type to fire webhook on.
      <options: PASS|SLOW|WARNING|FAIL>

  --add-exclude-tags=<value>...
      Add tag to excluded tags.

  --add-include-tags=<value>...
      Add tag to included tags.

  --api-key=<value>
      API key to use for authentication. Used by: [victorops, newrelic, datadog, datadogevent, statuspage, opsgenie,
      opsgenieeu].

  --app-key=<value>
      App key to use to identify this app. Used by [big_panda, newrelic].

  --call-id=<value>
      APImetrics API call to run. Can be found in the expanded Audit Logs of the desired API call in the Audit tab web
      page or by using the command `apimetrics calls --columns name,id`. Used by [apimetrics_api: required].

  --channel=<value>
      Integration channel name if different from that defined in the slack integration. Used by [slack].

  --component-id=<value>
      StatusPage component ID. Used by [statuspage].

  --disable
      Disable this webhook if not already disabled.

  --email-address=<value>
      Your email address. Used by [email, email_text, email_template].

  --enable
      Enable this webhook if it is not already enabled

  --fails-in-a-row=<value>
      Trigger webhook after this many successive failures. Used by all except apimetrics_token.

  --flow-token=<value>
      The token for the flow to post to. Used by [flowdock].

  --integration-key=<value>
      The service integration key with Integration Type: APImetrics. Used by [pager_duty, pager_duty_v2].

  --page-id=<value>
      Page ID for StatusPage. Used by [statuspage].

  --password=<value>
      Password to use for authentication. Used by [generic].

  --remove-alert=<option>...
      Remove result type to fire webhook on.
      <options: PASS|SLOW|WARNING|FAIL>

  --remove-exclude-tags=<value>...
      Remove tag from excluded tags.

  --remove-include-tags=<value>...
      Remove tag from included tags.

  --routing-key=<value>
      Routing key to route alert. Used by [victorops].

  --severity=<option>
      Severity of alert. Used by [pager_duty_v2].
      <options: critical|error|warning|info>

  --subject-template=<value>
      [default: [{{result_class}}]: APImetrics: {{ call_meta.name }}] Template for subject line. Used by [email_template].

  --text-template=<value>
      [default: {{ result }}: HTTP {{ http_code }} {{ http_reason }}
      Latency: {{ response_time }} ms
      Size: {{ response_size }} bytes

      Variables:
      {% for key, value in context|dictsort -%}
      - {{ key }}: {% if value is mapping %}...{% else %}{{ value }}{% endif %}
      {% endfor -%}

      Result: {{ result_url }}

      ] Template for email body. Used by [email_template].

  --token-id=<value>
      ID of project to modify. Overrides apimetrics config project set. Can be found in the Project Settings web page
      under the admin section or by using the command `apimetrics projects --columns name,id`.

  --url=<value>
      URL for webhook to call. Used by [generic, slack, hipchat, msteams].

  --user-key=<value>
      User key to use for authentication. Used by [big_panda].

  --username=<value>
      Username to use for authentication. Used by [generic].

  --webhook-id=<value>
      (required) Webhook to edit. Can be found using the command `apimetrics webhooks --columns name,id`.

  --workflow-id=<value>
      APImetrics workflow to run. Can be found by using the command `apimetrics workflows --columns name,id`. Used by
      [apimetrics_workflow: required].

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Edit a webhook.

EXAMPLES
  $ apimetrics webhooks edit
```

_See code: [src/commands/webhooks/edit.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.3.0/src/commands/webhooks/edit.ts)_
