---
title: Markdown
description: CommonMark and GFM from a string, static or streamed in word by word for AI answers.
component: markdown
category: base
tags: [markdown, streaming]
---

Renders CommonMark and GitHub tables, task lists and strikethrough with no innerHTML: raw HTML
is escaped and unsafe URLs are dropped, so model output and user input are safe to pass in.

## Streaming

Pass the whole text so far as `content` and set `streaming` while chunks arrive. Finished blocks
parse once; only the tail re-parses, and half-written `**bold` or `` `code `` renders closed.
Flip `streaming` to `false` when the answer ends, or drop it to render static text on the server.

Built on [`@docvia/markdown`](https://docvia.dev/docs/packages/markdown).
