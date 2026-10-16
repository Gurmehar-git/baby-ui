---
title: Radio Group
description: Single-choice group with roving focus and an indicator that scales in.
component: radio-group
category: base
tags: [radio, form, choice]
---

Real radio inputs underneath, visually hidden. Form submission and native grouping keep
working, and the keyboard behaviour comes free.

## Arrows select as they move

This surprises people, but it is the documented radio pattern: in a radio group, moving
with the arrow keys also changes the selection. Tab enters the group at the *selected*
option rather than the first, and leaves the group entirely on the next Tab. The whole
group is one tab stop.

If you need arrows to move without selecting, you do not want a radio group -- you want
a listbox.

## The indicator

The dot scales from 0.6 to 1, never from 0. Nothing in the world appears from nothing,
and a dot that pops in from zero reads as a glitch rather than a state change.
