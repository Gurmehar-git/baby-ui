---
title: Tips Panel
description: "A grid of short tips, each with one action that settles into a done state, and a running count of what's left."
component: tips-panel
category: blocks
tags: [tips, onboarding, discovery, nudges, getting started]
---

Composes `button`. Use it for gentle feature discovery on a home or settings page: a handful of
things worth trying, each one click away.

Built from parts:

```tsx
<TipsPanel value={done} onValueChange={setDone}>
  <TipsPanelHeader>
    <TipsPanelTitle>Tips</TipsPanelTitle>
    <TipsPanelProgress />
  </TipsPanelHeader>
  <TipsPanelContent>
    <TipsPanelGrid>
      <TipsPanelTip value="invite">
        <TipsPanelTipTitle>Invite your team</TipsPanelTipTitle>
        <TipsPanelTipDescription>Work on projects together in one place.</TipsPanelTipDescription>
        <TipsPanelAction onClick={openInvite}>Invite</TipsPanelAction>
      </TipsPanelTip>
    </TipsPanelGrid>
  </TipsPanelContent>
</TipsPanel>
```

`value` holds the ids of taken tips; it is controlled with `onValueChange` and bindable in
Svelte, so persist it wherever the rest of the user's settings live. `TipsPanelAction` marks
its tip done before running its own `onClick`, then reads `doneLabel`. Give `primary` to one
tip at most.

The count includes every mounted `TipsPanelTip`. The card scrolls past
`--tips-panel-max-height` (26rem), and the grid drops from three columns to two and one as the
card narrows.
