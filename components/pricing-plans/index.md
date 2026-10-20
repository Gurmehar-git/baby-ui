---
title: Pricing Plans
description: "Composable plan cards for monthly, yearly and lifetime pricing: a sliding cycle switch derived from the prices, rolling prices with yearly savings, and an action that hands off to hosted checkout."
component: pricing-plans
category: blocks
tags: [pricing, plans, tiers, lifetime, subscription, yearly, checkout, saas]
---

Needs `badge`, `button` and `rolling-digits`. Pair it with Pricing Comparison for the full
feature matrix below the cards.

Built from parts. The root holds the cycle and the money formatting; each part reads its plan,
so a full card needs no props beyond `plan`:

```tsx
<PricingPlans plans={plans} onSelect={checkout} loadingPlanId={loading}>
  <PricingPlansCycle />
  <PricingPlansGrid>
    {plans.map((plan) => (
      <PricingPlan key={plan.id} plan={plan}>
        <PricingPlanHeader>
          <PricingPlanTitle />
          <PricingPlanDescription />
        </PricingPlanHeader>
        <PricingPlanPrice />
        <PricingPlanAction />
        <PricingPlanFeatures />
      </PricingPlan>
    ))}
  </PricingPlansGrid>
</PricingPlans>
```

Reorder the parts, drop the ones you don't need, or pass children to `PricingPlanTitle`,
`PricingPlanDescription` and `PricingPlanAction` to replace their defaults.

Every amount is in cents.
- Each plan lists `prices` for the cycles it is sold on: `monthly`, `annual` and `lifetime`.
- `PricingPlansCycle` only offers cycles some plan is priced on, so a lifetime-only catalogue shows no switch. Its thumb slides between cycles.
- A plan with no prices reads as Custom and keeps its action, which suits an Enterprise "Contact" plan.
- Yearly shows the per month equivalent, the yearly charge and the saving against twelve monthly payments.
- Lifetime shows the one-time price and "Includes updates".
- Change any string through `labels`; `saveUpTo` takes a `{percent}` placeholder.

`PricingPlanAction` calls `onSelect(planId, cycle)`. Create the checkout session there, set
`loadingPlanId` so the button spins while the redirect loads, then send the browser to the
provider's hosted page. `availableCycles`, `planPrice` and `annualSavePercent` are exported
for a server-side price check.

## Migrating

`<PricingPlans plans={...} />` used to render the switch and every card itself. Keep the root's
props as they are and add the parts above inside it.
