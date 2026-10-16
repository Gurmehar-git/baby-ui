---
title: Button
description: Pressable button or link with variant and size axes, a blur-crossfaded loading face, and spring press feedback.
component: button
category: base
tags: [button, form, action]
---

Button is the smallest component that still has to get everything right. It carries two
visual axes, renders as either a `<button>` or an `<a>` without changing how it looks,
and swaps to a loading face without shifting the layout around it.

## When to use an anchor

Pass `href` and the component renders an `<a>`. The visuals are identical, but the
semantics are not: an anchor navigates, a button acts. Pick by what happens on
activation, not by how you want it to look.

One deviation from the platform: this anchor activates on <kbd>Space</kbd>. Browsers
don't do that natively, which surprises people who reach for a link that looks like a
button. The keyboard contract is the same across both forms on purpose.

## The loading face

`loading` does not swap the label. Both faces occupy the same grid cell, so the button
keeps its width, and the transition crossfades them through a 3px blur. Without the
blur you see two stacked labels sliding past each other; with it, you see one label
changing. The spinner is paused rather than unmounted when idle, so it never restarts
mid-rotation.

While loading, the button stays focusable and refuses activation. Removing it from the
tab order would move focus somewhere unpredictable at the exact moment the user is
waiting on the thing they just clicked.
