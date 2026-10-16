---
title: Code Block
description: Inset code frame with a language badge, filename, copy button and optional highlighter output.
component: code-block
category: base
tags: [code, block]
---

Pass `code` and it renders as text nodes, with optional line numbers. Pass `html` as well
and the block renders your highlighter's markup instead; `code` stays the copy source.

## Bring your own highlighter

Shiki, highlight.js and Prism all emit a `<pre><code>` tree; the block strips the outer
padding and background so the frame stays consistent, and gives Shiki's `.line` spans
their gutter. This site renders with Shiki on the server:

```ts
const html = await codeToHtml(source, { lang: "ts", theme: "github-dark-default" });
```

```svelte
<CodeBlock {code} {html} language="ts" filename="lib/cn.ts" />
```

Plain mode has no `innerHTML`, so an untrusted snippet cannot inject markup. Line numbers
are `aria-hidden` and unselectable, so a copy gives you code, not code with a gutter.
