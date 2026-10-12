---
title: Expanding Button Group
description: "A pill of icon buttons where one action always shows its label: pointing at or focusing another slides the label over, and actions confirm in place."
component: expanding-button-group
category: advanced
tags: [toolbar, actions, morph]
---

One action always shows its label. Give an action a `doneLabel` to confirm in place, and return a
promise from `onSelect` to show it busy until the work settles.
