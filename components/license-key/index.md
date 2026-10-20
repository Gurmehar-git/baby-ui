---
title: License Key
description: "A masked registry token with reveal, copy and a confirmed regenerate, plus the components.json and .env setup for shadcn and shadcn-svelte."
component: license-key
category: blocks
tags: [license, api key, token, registry, shadcn, settings]
---

Needs `button`, `copy-button` and `tabs`. Put it on the account page of anything that sells
access to a private shadcn registry, lifetime or subscription.

The key shows as its prefix and last 4 characters until revealed. Copy always copies the
real key. Setup text comes from three helpers, each shown in a `LicenseKeyCode` inside a
`LicenseKeyStep`: `registrySnippet(name, url, env)` for the `components.json` entry,
`envLine(env, key)` for `.env`, and `installCommand(framework, name, item)`.

Regenerate is controlled. The button asks for `"confirming"`, which opens a confirm step
warning that the old key stops working. `onRotate` fires from there: set `"rotating"`, then
`"idle"` with the new `licenseKey`, or `"error"` with an `error` message. Svelte binds
`status`; React pairs it with `onStatusChange`.

`plan`, `seats`, `createdAt` and `lastUsedAt` fill the meta row; leave any out to hide it.
`lastUsedAt={null}` reads "Never used".
