---
title: Auth Form
description: "Sign in or sign up with providers, a passkey, or email and a one-time code; every step and status comes from your props."
component: auth-form
category: blocks
tags: [auth, sign in, sign up, login, otp, passkey, sso, form]
---

Composes `field`, `input`, `password-input`, `checkbox`, `input-otp` and `button`. The form
validates; your handlers talk to the server and set `step` and `status`, so spinners, errors
and the code step always reflect real requests.

`mode="sign-up"` unfolds name, password and a product updates checkbox. After `onSubmit`,
set `step="code"` and `resendAt`; `onCode` fires once every digit is in. Providers take your
own icons, and `onPasskey` adds a passkey button when signing in.
