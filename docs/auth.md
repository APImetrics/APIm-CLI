`apimetrics auth`
=================

Manage authentication options.

* [`apimetrics auth login`](#apimetrics-auth-login)
* [`apimetrics auth logout`](#apimetrics-auth-logout)

## `apimetrics auth login`

Login to APImetrics CLI.

```
USAGE
  $ apimetrics auth login [--json] [--key <value>]

FLAGS
  --key=<value>  API key when using API key auth.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Login to APImetrics

ALIASES
  $ apimetrics login

EXAMPLES
  $ apimetrics auth login --key <api key>
```

_See code: [src/commands/auth/login.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/auth/login.ts)_

## `apimetrics auth logout`

Logout of APImetrics CLI.

```
USAGE
  $ apimetrics auth logout [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Logout

EXAMPLES
  $ apimetrics auth logout
```

_See code: [src/commands/auth/logout.ts](https://github.com/APImetrics/APIm-CLI/blob/v0.2.1/src/commands/auth/logout.ts)_
