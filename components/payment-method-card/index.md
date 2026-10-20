---
title: Payment Method Card
description: "The card or wallet on file with an expiry warning, an empty state and an update action that hands off to your provider's portal."
component: payment-method-card
category: blocks
tags: [payment method, credit card, billing, expiry, wallet, saas, dashboard]
---

Needs `badge` and `button`. It shows what your provider has on file and never collects card
details itself.

Built from parts. The root holds the method and the portal status; the parts read it:

```tsx
<PaymentMethodCard method={method} now={now} status={status}>
  <PaymentMethodCardTitle />
  <PaymentMethodCardContent>
    <PaymentMethodCardMark />
    <PaymentMethodCardDetails />
    <PaymentMethodCardAction onClick={openPortal} />
  </PaymentMethodCardContent>
  <PaymentMethodCardError />
</PaymentMethodCard>
```

`PaymentMethodCardAction` should send the customer to the provider's hosted portal or
checkout. Drop the title for a settings row with the `inline` variant.

`method` is a card (`brand`, `last4`, `expMonth`, `expYear`), a PayPal or Link wallet with an
`email`, or `null`. Null shows the empty state, and the action reads Add payment method.

A card is valid through the last day of its expiry month. Within 60 days of that, it shows an
Expires soon badge; after it, Expired. Both are measured from `now`, which you pass in.

Set `status` to `redirecting` while you create the portal session, and to `error` if that
fails. The error folds open under the row and is announced to screen readers.

## Migrating

`<PaymentMethodCard method={...} onUpdate={...} />` used to render every region itself. Keep
the root's props and compose the parts above: `onUpdate` moves to `PaymentMethodCardAction`'s
`onClick`, and `headingLevel` to `PaymentMethodCardTitle`.
