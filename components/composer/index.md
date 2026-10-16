---
title: Composer
description: Chat input that grows with content, sends on Enter, and composes a model picker and an actions menu.
component: composer
category: agents
tags: [composer, prompt, chat, input]
---

Enter sends, Shift+Enter breaks the line. This is the convention every chat client uses,
and inverting it strands anyone writing more than a sentence. A composing Enter, the one
that commits an IME conversion, never submits.

The send button is disabled while empty, disabled, or `loading` rather than hidden, so its
position never shifts under the cursor. `loading` swaps it to a Stop button wired to
`onStop`; there's no internal timer pretending a send is in flight, that state is entirely
yours. Height follows content with no easing, for the same reason as Textarea: an eased
grow lags the caret.

## Model picker and actions menu

Pass `models` to show a model picker built on the real `Select`; pass `actions` to show a
"+" button (its glyph rotates 45° while open, a plain CSS transform) built on the real
`DropdownMenu`. Both are omitted entirely, not shown empty, when you don't pass them;
there's no fictional default list baked in.

## Controlled or uncontrolled

`value` and `model` both work either way: pass `value`/`model` with `onValueChange`/
`onModelChange` for a controlled field, or a bare `defaultValue`/`defaultModel` (React) /
`bind:value`/`bind:model` (Svelte) and let the component hold its own draft.
