---
title: File Diff
description: Unified diff with added and removed lines carried by more than colour.
component: file-diff
category: base
tags: [file, diff]
---

Every changed line carries a visually hidden "Added" or "Removed" prefix. Red and green
are the single most common colour-blind confusion, and a diff that encodes the change only
in background colour is unreadable for a lot of people.

The `+` and `-` markers are `aria-hidden` because the hidden prefix already says it, and
both markers and line numbers are unselectable so copying a hunk gives you the code.
