---
title: Label
description: Form label with a required marker and a disabled state that matches its control.
component: label
category: base
tags: [label, form, field]
---

A real `<label>` element, so clicking the text focuses the control. That is the entire
reason to use a component here rather than a styled `<span>`.

## The asterisk is decoration

The required marker is `aria-hidden`. Mark the control itself `required` and the state
is announced once. Leave the marker visible and unhidden, and a screen reader reads
"star" after every required field name.
