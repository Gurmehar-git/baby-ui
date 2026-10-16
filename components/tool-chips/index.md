---
title: Tool Chips
description: "An agent run as compact rows: tool calls with inline chips, then file-diff chips."
component: tool-chips
category: agents
tags: [tool, diff, agent, run]
---

Each tool call is a row with a chip summarizing what it did; click a row to expand its
detail lines. File-diff chips follow underneath: hover one for a real `HoverCard` preview
of the actual diff.

## No scripted reveal

`steps` and `diffs` render immediately with a mount-time stagger, not a timed "the agent is
working" sequence; if a caller wants a live-streaming feel, they push into `steps`
progressively themselves and the component renders whatever's currently there.

## No fictional default

Both `steps` and `diffs` are required: there's no built-in sample run.
