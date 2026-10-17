---
title: MCP
description: Connect an AI coding tool to Baby UI, so it can search components, read their docs and install them.
---

Baby UI runs a remote MCP server. It is read-only, needs no key, and answers with the same
reference you get on each component's page.

```txt
https://baby-ui.nexonauts.com/api/mcp
```

## Add it to your tool

```json
{
  "mcpServers": {
    "baby-ui": { "type": "http", "url": "https://baby-ui.nexonauts.com/api/mcp" }
  }
}
```

That block works in Cursor (`.cursor/mcp.json`), VS Code (`.vscode/mcp.json`, under
`servers`) and Claude Desktop. In Claude Code:

```bash
claude mcp add --transport http baby-ui https://baby-ui.nexonauts.com/api/mcp
```

## Tools

| Tool | What it returns |
| --- | --- |
| `search_components` | The best matches for an intent or name, each with its markdown docs URL. |
| `list_components` | Every component, optionally filtered by `category` or `tier`. |
| `get_component` | One component's full reference: when to use it, what to use instead, install, usage, props, keyboard, accessibility, motion and notes for AI. |
| `get_install_command` | The `@baby-ui/cli add` command for one or more slugs, for any package manager. |

Pro components appear in search and docs; their source installs from your account page.

## In the browser

Pages on this site also offer the same tools through WebMCP, plus `open_component`, which
opens a component's page. A browser agent that supports WebMCP finds them without any setup.

Prefer plain files? [llms.txt](/llms.txt) lists every component with a link to its markdown.
