---
title: Reaction Bar
description: "Like, comment, repost and share in one row: a pressed icon fills and pops, and its count rolls in."
component: reaction-bar
category: blocks
tags: [reactions, like, comment, share, social, engagement]
---

Composes `rolling-digits`. Put it under anything people respond to: a post, a comment, a shared
link.

Built from parts:

```tsx
<ReactionBar value={pressed} onValueChange={setPressed}>
  <ReactionBarItem value="like" label="Like" count={127} tone="destructive">
    <ReactionBarIcon icon="like" />
    <ReactionBarCount />
  </ReactionBarItem>
  <ReactionBarItem value="comment" label="Comment" count={18} tone="primary">
    <ReactionBarIcon icon="comment" />
    <ReactionBarCount />
  </ReactionBarItem>
</ReactionBar>
```

`value` lists what the viewer has pressed; it is controlled with `onValueChange` and bindable in
Svelte. `count` is everyone else's reactions: the viewer's own press adds one while it is held,
so the number is right before your server answers. Counts read compactly (1.2K) in `locale`.

`ReactionBarIcon` takes a built-in `icon` (like, comment, repost, share) or your own as
children. `tone` colours a pressed item. `variant="chips"` sets each action apart as a quiet
chip.
