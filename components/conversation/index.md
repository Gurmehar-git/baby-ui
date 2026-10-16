---
title: Conversation
description: "Transcript viewport that follows new turns only when the reader is at the bottom."
component: conversation
category: agents
tags: [conversation, chat, transcript, auto-scroll]
---

Auto-scroll is suspended the moment you scroll up, and a jump-to-latest control appears.
Pulling someone back to the bottom while they're reading an earlier message is the single
most common bug in a chat transcript, and it's infuriating.

"At the bottom" means within `threshold` px (default 80), which tolerates sub-pixel
scroll rounding without feeling loose.

## Parts

- `Conversation`: the root; owns the follow/detached state.
- `ConversationContent`: the scrollable transcript itself (`role="log"`, live region).
- `ConversationEmpty`: placeholder shown before the first turn.
- `ConversationScrollButton`: the jump-to-latest control; appears only once detached.

```tsx
<Conversation>
  <ConversationContent>
    {turns.length === 0 ? <ConversationEmpty /> : turns.map((t) => <Message {...t} />)}
  </ConversationContent>
  <ConversationScrollButton />
</Conversation>
```

`Conversation` doesn't constrain its own height: give its container a real height and
pass `className="h-full"` to `Conversation` itself so it actually fills it; otherwise the
transcript just grows with its content instead of scrolling.
