---
title: Verify Email
description: Confirms a new account's email address with a one-time link and an optional code.
component: email-verify
category: emails
tags: [email, verify, confirm, sign up, transactional]
---

Built from the [Email Kit](/emails/email-kit), themed from your tokens and switched to your dark palette when the inbox is. Send it right after sign-up. The address is shown back so readers with several accounts know which one this is, and the link is repeated as text for clients that block buttons. Pass `code` when people often sign up on one device and read mail on another.

Everything is centred, with a security notice, a help list and a footer band.

## Send it

Render and send it exactly like the [Welcome Email](/emails/email-welcome): render HTML and plain text on the server, then pass both to your provider. Swap the component and its props.
