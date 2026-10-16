---
title: FAQ Section
description: "Frequently asked questions as one centred accordion, a topic rail beside its questions, or a list that filters and highlights as you type."
component: faq-section
category: blocks
tags: [faq, questions, help, support, accordion, search, section]
---

Composes `accordion`, `toggle-group`, `search-input` and `button`. Each item needs a
`question` and a plain-text `answer`; `category` groups it in the `columns` variant.

`search` matches questions and answers while ignoring accents, marks every match, and shows
a short excerpt under a closed question that only matches in its answer.

Open answers, the topic and the query are all controllable: `value`, `category` and `query`
with their `on...Change` callbacks, or `bind:` in Svelte.
