---
title: Text Loop
description: "Loops through items, each sliding out as the next slides in behind it."
component: text-loop
category: text
tags: [text, loop, rotate, slide]
---

Fully controlled through `index`/`onIndexChange`, or it loops every `intervalMs`. The
longest item reserves the width, so the sentence around it never reflows.

`variant` picks the motion: `slide` through a clipped window, `fade` to blur the next item in
place while the last drifts out, or `roll` to turn a stack like a flip counter. Put a fixed
label such as "Coding is" outside the component, as plain text.
