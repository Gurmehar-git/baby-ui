# @baby-ui/cli

Add Baby UI components to React and Svelte apps. Reads the same `components.json` as shadcn and shadcn-svelte, writes the same files, and adds undo, repair and update on top.

```sh
npx @baby-ui/cli init
npx @baby-ui/cli add button dialog
```

Or `pnpm dlx`, `yarn dlx`, `bunx`. `npm create baby-ui` runs `init`.

## Commands

| Command | Does |
| --- | --- |
| `init` | Writes `components.json`, `utils` and the theme |
| `add <items...>` | Baby UI names, `@namespace/name`, URLs or local `.json` files |
| `list [query]` | Browse the registry; installed items are marked |
| `diff [items...]` | Compare installed files with the registry (`--exit-code` for CI) |
| `update [items...]` | Pull registry changes; files you edited are never overwritten silently |
| `repair [items...]` | Restore missing files, broken imports, CSS and packages |
| `repair --adopt` | Track components installed by the stock shadcn CLI |
| `doctor` | Read-only health check |
| `undo` / `history` / `revert <id>` | Roll back any change, including CSS and `package.json` |
| `login` / `logout` / `whoami` | Pro licence key (`BABY_UI_TOKEN` in CI) |
| `info` | Detected projects, frameworks, aliases and package managers |

## Monorepos

Run inside a package, or pass `--target <name|path>` (repeatable) or `--all` from the root. shadcn's workspace layout works: ui files, their packages and CSS go to the ui package.

## Files it keeps

- `.baby-ui/lock.json`: what was installed and the hash of each file written. Commit it.
- `.baby-ui/history/`: undo snapshots, gitignored automatically, last 20 kept.

`components.json` is never given extra keys, so the stock CLIs keep working on the same project.
