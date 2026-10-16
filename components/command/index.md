---
title: Command
description: Command, CommandDialog, CommandHeader, CommandInput, CommandList, CommandGroup and CommandItem, driven entirely from the keyboard.
component: command
category: base
tags: [command]
---

The panel scales and drops from above its shortcut, the same duration tokens as Dialog.
It uses the same inset frame: a thin `bg-background` rim around a `bg-card` body, the same
treatment as Dialog and Card's `framed` variant. `CommandHeader` is optional and hoists
itself into that rim: a title on the left, an "esc close" hint on the right built from our
own `Shortcut` component, so the search input and results sit in the card below it.

## Focus never leaves the input

`aria-activedescendant` points at the highlighted row while focus stays in the text field,
so typing and arrowing do not fight each other. The highlight resets to the first result
on every keystroke, because keeping the old index means Enter runs whatever happens to be
in that position now. A single marker glides between rows rather than repainting a
background on each one.

## The result count

The number next to the input and a debounced `aria-live` region both read from the same
filtered count, so a sighted user and a screen reader agree on how many rows survived the
search.

## Search resets on open, not on unmount

The native `<dialog>` stays mounted through the close transition so it has something to
animate out; that means `Command`'s internal search state would otherwise survive into the
next open. It clears the moment `CommandDialog`'s `open` flips true instead, which reads
the same to a caller as if the whole tree had remounted.
