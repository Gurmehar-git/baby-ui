---
title: Magic Link Login
description: "Passwordless sign-in: an email form, optional OAuth buttons, then a check-your-inbox view with a resend countdown."
component: magic-link-login
category: blocks
tags: [login, sign in, magic link, passwordless, auth, email]
---

Needs `button`, `input` and `label`. It is the UI only: wire `MagicLinkLoginEmail`'s
`onSubmit` to whatever sends the link (better-auth's magic link plugin, your own endpoint) and
set `status` from the result.

Built from parts. The root holds the status, the email and the resend clock; the parts read
it:

```tsx
<MagicLinkLogin status={status} email={email} onEmailChange={setEmail} now={now} resendAvailableAt={until}>
  <MagicLinkLoginPanel>
    <MagicLinkLoginBrand>Acme</MagicLinkLoginBrand>
    <MagicLinkLoginViews>
      <MagicLinkLoginForm>
        <MagicLinkLoginHeader />
        <MagicLinkLoginProviders providers={providers} onProvider={redirect} />
        <MagicLinkLoginEmail onSubmit={send} />
        <MagicLinkLoginLegal>By continuing you agree to the Terms.</MagicLinkLoginLegal>
      </MagicLinkLoginForm>
      <MagicLinkLoginSent>
        <MagicLinkLoginSentHeader />
        <MagicLinkLoginInbox />
        <MagicLinkLoginResend onResend={resend} onBack={() => setStatus("idle")} />
      </MagicLinkLoginSent>
    </MagicLinkLoginViews>
  </MagicLinkLoginPanel>
</MagicLinkLogin>
```

The component is controlled. `onSubmit` fires with the trimmed, lowercased address once it
passes a pragmatic format check; you set `"sending"`, then `"sent"` or `"error"` with an
`error` message, which folds open under the field. `"sent"` swaps in the inbox view and moves
focus to its heading.

The resend cooldown has no clock of its own. Pass `resendAvailableAt` from your rate limit
and tick `now`, and the button reads "Send again in 0:24" until it unlocks. Gmail, Outlook,
Yahoo, iCloud, Proton and Fastmail addresses get an "Open Gmail" style button; anything else
gets none rather than a guess.

`MagicLinkLoginProviders` adds OAuth buttons above an "or" divider, and `pending` spins one
while its redirect is in flight. With `layout="split"`, put `MagicLinkLoginAside` before the
panel for a brand column from md up. Every string is in `labels`.

## Migrating

`<MagicLinkLogin status={...} onSubmit={...} />` used to render every region itself. Keep the
root's status, email, error, clock, variant, layout and labels props and compose the parts
above: `onSubmit` moves to `MagicLinkLoginEmail`; `providers`, `onProvider` and
`pendingProvider` to `MagicLinkLoginProviders` (`pending`); `onResend` and `onBack` to
`MagicLinkLoginResend`; `brand`, `legal` and `aside` become `MagicLinkLoginBrand`,
`MagicLinkLoginLegal` and `MagicLinkLoginAside`; `headingLevel` goes on both headers.
