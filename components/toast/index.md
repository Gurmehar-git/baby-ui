---
title: Toast
description: "A styled stack on sonner: one Toaster, then toast() from anywhere."
component: toast
category: base
tags: [toast, sonner, notification]
---

Mount `Toaster` once near the root, then call `toast()` from any module. sonner (React) and
svelte-sonner (Svelte) own stacking, swipe to dismiss, timers and the live region; every
class on the toast is ours: round tinted icon, title, two-line description, pill action,
round close.

## Calls

```ts
toast("Draft saved");
toast.success("Invite sent", { description: "mia@acme.dev can join." });
toast.error("Payment declined", { action: { label: "Retry", onClick: retry } });
toast.promise(deploy(), { loading: "Deploying…", success: "Live", error: "Failed" });
```

## Timing

Four seconds by default, paused while the pointer is over the stack or the tab is hidden.
Pass `duration: Infinity` for anything a person must act on; `closeButton` stays on so it
can always be dismissed.
