---
title: Decision Inbox
description: "Open decisions with a quick answer each: the answer shows for a beat, the row folds away and the count goes down."
component: decision-inbox
category: agents
tags: [decisions, inbox, approvals, queue, agent, triage]
---

Composes `button`. Use it for the queue of small choices an agent or a teammate is waiting on:
approve a refund, pick a meeting slot, confirm an email goes out.

Built from parts:

```tsx
<DecisionInbox value={answers} onValueChange={setAnswers}>
  <DecisionInboxHeader />
  <DecisionInboxList>
    <DecisionInboxItem value="refund">
      <DecisionInboxTitle>Refund order #4821?</DecisionInboxTitle>
      <DecisionInboxBody>
        <DecisionInboxDetail>Customer reports the parcel never arrived.</DecisionInboxDetail>
        <DecisionInboxActions>
          <DecisionInboxAction value="Refunded" primary>Refund</DecisionInboxAction>
          <DecisionInboxAction value="Declined">Decline</DecisionInboxAction>
        </DecisionInboxActions>
      </DecisionInboxBody>
    </DecisionInboxItem>
  </DecisionInboxList>
  <DecisionInboxEmpty>Nothing waiting on you.</DecisionInboxEmpty>
</DecisionInbox>
```

`value` maps each decision to its answer; it is controlled with `onValueChange` and bindable
in Svelte, so send the answer to your backend from there. The chosen `DecisionInboxAction`'s
`value` is what the row shows before it folds away after `--decision-inbox-hold` (1s).
`collapsed` folds decisions to one muted line until clicked, for the ones that can wait.

Answering moves focus to the next open decision, so a keyboard user can work down the list.
