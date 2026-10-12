---
title: Mention Input
description: "A textarea with @ people and # channel mentions that move and delete as single tokens."
component: mention-input
category: advanced
tags: [mention, textarea, comment, chat, autocomplete]
---

The value is `{ text, mentions }`: `text` is what was typed and each mention records its `kind`,
`id` and offsets. Use `serializeMentions(value)` to store it as `<@id>` and `<#id>` tokens.
