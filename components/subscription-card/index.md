---
title: Subscription Card
description: "Current plan at a glance: price, status, renewal or trial date, a seats meter and billing actions, with cancel behind a confirmation."
component: subscription-card
category: blocks
tags: [subscription, billing, plan, seats, renewal, cancel, saas, dashboard]
---

Needs `alert-dialog`, `badge`, `button` and `progress`. Put it at the top of an account or
billing page.

Built from parts. The root holds the plan, its dates and the pending action; the parts read it:

```tsx
<SubscriptionCard plan={plan} renewsAt={renewsAt} now={now} pending={pending}>
  <SubscriptionCardHeader>
    <SubscriptionCardTitle />
    <SubscriptionCardPrice />
  </SubscriptionCardHeader>
  <SubscriptionCardSchedule />
  <SubscriptionCardAlert onUpdatePayment={updatePayment} />
  <SubscriptionCardSeats used={8} total={10} />
  <SubscriptionCardFooter>
    <SubscriptionCardManage onClick={openPortal} />
    <SubscriptionCardChangePlan onClick={toPricing} />
    <SubscriptionCardResume onClick={resume} />
    <SubscriptionCardCancel onClick={cancel} />
  </SubscriptionCardFooter>
</SubscriptionCard>
```

The card works with any provider because it never talks to one. Every action is a part with
its own handler: Manage usually redirects to the provider's billing portal, Cancel posts to
your server after the customer confirms. Leave a part out to drop its action. Resume and Cancel
show themselves only when the plan allows them.

While your request is in flight, set `pending` to the action's name. Its button shows a spinner
and the rest disable until you set it back to `null`.

Amounts are in cents. The status decides the line under the price:

- `active` shows the renewal date from `renewsAt`
- `trialing` shows `trialEndsAt`
- `canceled` shows `endsAt`, with Resume plan while that date is still ahead
- `past_due` folds open the payment notice with its Update payment method action
- `lifetime` reads "Lifetime access, updates included."

Relative dates are measured from `now`, which you pass in. Use the server's time on first render
so the day count matches after hydration.

## Migrating

`<SubscriptionCard plan={...} onManage={...} />` used to render every region itself. Keep the
root's plan, date, `pending`, `variant`, `locale` and `labels` props and compose the parts
above: `headingLevel` moves to `SubscriptionCardTitle`, `seats` to `SubscriptionCardSeats`,
`onUpdatePayment` to `SubscriptionCardAlert`, and each `on*` action to its part's `onClick`.
