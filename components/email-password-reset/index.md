---
title: Password Reset
description: Password reset link with the request's origin and a clear path for readers who didn't ask.
component: email-password-reset
category: emails
tags: [email, password, reset, security]
---

Built from the [Email Kit](/emails/email-kit), themed from your tokens and switched to your dark palette when the inbox is. The warning tells readers who didn't ask that their password is unchanged, and links to `securityUrl` when you pass one. Keep `expiresIn` short; an hour is typical.

A tinted panel shows `requestedAt`, then a full-width button and a footer band.

## Send it

Render and send it exactly like the [Welcome Email](/emails/email-welcome): render HTML and plain text on the server, then pass both to your provider. Swap the component and its props.
