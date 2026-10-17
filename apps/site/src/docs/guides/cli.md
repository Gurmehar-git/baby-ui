---
title: CLI
description: Add Baby UI and shadcn components, then diff, update, repair and undo them, from one command.
---

`@baby-ui/cli` reads the same `components.json` as shadcn and shadcn-svelte and writes the
same files. On top it keeps a lock of what it installed, so it can show drift, pull updates
without clobbering your edits, repair a broken install and undo any change.

```bash
# pm: dlx @baby-ui/cli add button
```

Run it with any package manager, or install it as a dev dependency to get a `baby-ui`
command. `npm create baby-ui` runs `init`.

## Commands

| Command | Does |
| --- | --- |
| `init` | Writes `components.json`, `utils` and the theme |
| `add <items...>` | Adds components and their dependencies |
| `list [query]` | Browses the registry; installed items are marked |
| `diff [items...]` | Compares installed files with the registry |
| `update [items...]` | Pulls registry changes; edited files are never overwritten silently |
| `repair [items...]` | Restores missing files, broken imports, CSS and packages |
| `doctor` | Read-only health check |
| `undo` | Reverts the last change, including CSS and `package.json` |
| `history` / `revert <id>` | Lists changes and reverts any one of them |
| `info` | Shows detected projects, frameworks, aliases and package managers |
| `login` / `logout` / `whoami` | Manages the Pro licence key |

## What `add` takes

| Specifier | Resolves to |
| --- | --- |
| `button` | Baby UI, for the framework in `components.json` |
| `@shadcn/card` | shadcn/ui or shadcn-svelte's own registry |
| `@acme/widget` | A registry under `registries` in `components.json` |
| `https://…/item.json` | Any registry item URL |
| `./item.json` | A local registry item |

TypeScript or JavaScript follows `tsx` (React) or `typescript` (Svelte) in `components.json`.

## Flags

- `--dry-run` on `init`, `add`, `update` and `repair` prints the plan and writes nothing.
- `-o, --overwrite` replaces files that differ without asking.
- `--no-install` writes `package.json` entries but skips the install.
- `-y, --yes` takes every prompt's default; this is automatic in CI and without a TTY.
- `--cwd <dir>` runs against another directory.

## Keep components current

```bash
baby-ui diff             # what changed upstream, and what you changed
baby-ui update dialog    # pull it; your edited files are kept unless you say otherwise
baby-ui undo             # changed your mind
```

`diff --exit-code` exits 1 on drift, for CI. `update` asks before replacing a file you edited,
and `undo` refuses to run over edits made since, unless you pass `--force`.

## Coming from the shadcn CLI

Nothing to migrate: the same `components.json` works with both CLIs, and `baby-ui` never adds
keys the stock CLIs would reject. To bring components the stock CLI installed under the lock:

```bash
baby-ui repair --adopt
```

## Monorepos

Run it inside a package, or from the root with `--target <name|path>` (repeatable) or `--all`.
shadcn's workspace layout works: ui files, their packages and CSS go to the ui package.

## Files it keeps

- `.baby-ui/lock.json`: what was installed and a hash of every file written. Commit it.
- `.baby-ui/history/`: undo snapshots, gitignored automatically, last 20 kept.

## Pro

`baby-ui login` saves your licence key; then `baby-ui add @baby-ui-pro/<name>`. In CI, set
`BABY_UI_TOKEN` instead.
