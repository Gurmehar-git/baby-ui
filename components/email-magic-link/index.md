---
title: Magic Link
description: Passwordless sign-in with a one-time link, an optional code and the request's origin.
component: email-magic-link
category: emails
tags: [email, magic link, otp, sign in, passwordless]
---

Built from the [Email Kit](/emails/email-kit), themed from your tokens and switched to your dark palette when the inbox is. With `code` set, the code leads and the button becomes the alternative; without it, the button is the whole email. `requestDetails` (device, location, time) lets a reader spot an attempt that wasn't theirs. The default preview line includes the code so it shows in notifications; override `preview` if your threat model says otherwise.

The code sits in a tinted panel above a full-width button; without `code`, the button leads.

## Send it

Render and send it exactly like the [Welcome Email](/emails/email-welcome): render HTML and plain text on the server, then pass both to your provider. Swap the component and its props.
