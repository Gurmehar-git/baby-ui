---
title: Chat Composer
description: "A controlled chat panel: topic toggles, a scrolling thread and a composer, built from registry parts."
component: chat-composer
category: agents
tags: [chat, composer, conversation, agent]
---

A fixed-height chat panel composed from Card, ToggleGroup, Button, DropdownMenu and Textarea.
It never invents replies: you pass `messages`, append to them in `onSend`, and set `status` to
`streaming` while an answer is still resolving.

## Header controls

- **Topics** switch the active thread (`topic`, controlled or bindable).
- **New** appears when you pass `onNew`.
- **Prompt history** lists recent user prompts from `messages`; picking one sends it again.
- **More actions** copies the thread to the clipboard and announces the result.

## Data shape

```tsx
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  body: string;
  author?: string; // assistant name above the body
  meta?: string; // muted detail, e.g. "for 4s"
};

type ChatTopic = { key: string; label: string };
```
