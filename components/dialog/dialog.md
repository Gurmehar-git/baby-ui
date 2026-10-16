---
title: Dialog
description: Centred dialog on the platform top layer, composed from trigger, content, header, title, description and footer.
component: dialog
category: base
tags: [dialog, modal]
---

Built on the native `<dialog>` element. The top layer, the backdrop, and making the rest
of the page inert all come from the browser, which means no focus-trap library and no
`aria-hidden` sprayed across the document.

## Closing is instant

Opening animates; closing does not. Once you have clicked Cancel the decision is made,
and 280ms of fade is latency between you and whatever you wanted to do next.
