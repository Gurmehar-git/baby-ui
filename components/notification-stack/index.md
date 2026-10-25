---
title: Notification Stack
description: "Notices stacked behind each other: only the front card reads, the rest peek out below, and dismissing one brings the next forward."
component: notification-stack
category: blocks
tags: [notifications, notices, announcements, stack, cards]
---

Composes `badge` and `button`. Use it for announcements someone works through one at a time:
what's new, a plan limit, a setup nudge.

Built from parts:

```tsx
<NotificationStack value={dismissed} onValueChange={setDismissed}>
  <NotificationStackItem value="sso">
    <NotificationStackPattern pattern="orbit" />
    <NotificationStackBody>
      <NotificationStackHeader>
        <NotificationStackBadge>New</NotificationStackBadge>
        <NotificationStackDismiss />
      </NotificationStackHeader>
      <NotificationStackTitle>Single sign-on is here</NotificationStackTitle>
      <NotificationStackDescription>Connect Okta or Google Workspace.</NotificationStackDescription>
      <NotificationStackActions>
        <NotificationStackAction href="/settings/sso">Set it up</NotificationStackAction>
      </NotificationStackActions>
    </NotificationStackBody>
  </NotificationStackItem>
  <NotificationStackEmpty>You're all caught up.</NotificationStackEmpty>
</NotificationStack>
```

The first item in the DOM is the front card. Cards behind it sit on its bottom edge, two deep,
and the stack's height follows the front card. `value` lists dismissed notices; it is controlled
with `onValueChange` and bindable in Svelte. A dismissed card stays mounted so it can slide away,
so remove it from your data whenever you like.

Dismissing moves focus to the next card's close button, so a keyboard user can clear the stack
without hunting for it.
