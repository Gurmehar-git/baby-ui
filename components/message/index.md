---
title: Message
description: Composable chat-turn parts, shadcn-primitive style, with a spring entrance and independent colour variant.
component: message
category: agents
tags: [message, chat, ai]
---

Message is a set of parts, not one component with a dozen props. Compose the ones you need;
`Message` only owns alignment and the entrance, everything else (avatar, header, bubble colour,
footer) is a separate part that reads `Message`'s state off `data-*` attributes and group
selectors, the same way shadcn's own primitives compose.

## Parts

- `MessageGroup`: wraps several turns from one sender; clips sideways entrance travel.
- `Message`: the row. Owns `align` and the entrance; everything else is a child.
- `MessageAvatar`: a styled slot, not an image component; pass your own `<img>`/icon.
- `MessageContent`: the column of header/bubble/footer; self-aligns to `Message`'s `align`.
- `MessageBubble`: the coloured pill; `variant` is its own axis, independent of `align`.
- `MessageHeader` / `MessageFooter`: thin metadata rows (sender name, timestamp).
- `MessageTyping`: a three-dot "thinking" indicator, styled to sit inside a bubble.

```tsx
<Message align="end">
  <MessageContent>
    <MessageBubble variant="primary">What does the registry emit?</MessageBubble>
  </MessageContent>
</Message>
```

## Colour and alignment are independent

`align` (`start`/`end`) only decides which side the row sits on and which way it enters from.
`MessageBubble`'s `variant` picks the pill's colour on its own: `default` (muted, the
received-style look), `primary` (filled, for sent turns), `ghost` (drops the pill entirely,
for bare text like a streamed reply). Nothing ties a colour to a side, so a `start`-aligned
turn can use `primary` and an `end`-aligned one can use `ghost`.

## Motion

`motion="spring"` (the default) plays a CSS overshoot standing in for a real spring: slide in
from the side `align` points away from, with a scale settle, the same `--ease-spring` token
and 420ms duration TextTransition's spring preset uses. `fade` is opacity-only; `none` skips
the entrance. `animated={false}` skips it regardless of `motion`, for history already on
screen, so only a newly arriving message plays its entrance.

## Layout follows the parts you include

There's no `layout` prop. Drop `MessageAvatar` for a dense turn; drop `MessageHeader` and
`MessageFooter` for a bare bubble; nest a `MessageTyping` inside `MessageBubble` in place of
its text while a reply is pending. The row's own width already stays unconstrained, so a wide
turn is just a wide `MessageBubble`.
