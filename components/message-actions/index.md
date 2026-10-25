---
title: Message Actions
description: "The row under an assistant reply: copy, regenerate, versions, thumbs and read aloud, each answering the press in place, with a reason form on a thumbs down."
component: message-actions
category: agents
tags: [message, chat, assistant, feedback, thumbs, copy]
---

Composes `copy-button`, `toggle-group`, `input` and `button`. Put it under each assistant reply.

Built from parts:

```tsx
<div className="group/message">
  <p>{reply}</p>
  <MessageActions feedback={feedback} onFeedbackChange={setFeedback}>
    <MessageActionsBar>
      <MessageActionsCopy text={reply} />
      <MessageActionsRegenerate loading={writing} onClick={regenerate} />
      <MessageActionsVersions value={version} count={versions.length} onValueChange={setVersion} />
      <MessageActionsFeedback />
      <MessageActionsSpeak pressed={speaking} onPressedChange={setSpeaking} />
    </MessageActionsBar>
    <MessageActionsFeedbackPanel reasons={["Not accurate", "Too long", "Other"]} onSubmit={send} />
  </MessageActions>
</div>
```

`feedback` is the vote; it is controlled with `onFeedbackChange` and bindable in Svelte. The
panel opens on a thumbs down and calls `onSubmit` with the reason, or the typed text when the
reason is `otherReason`.

The `quiet` variant fades the bar to half strength until its `group/message` is hovered, focus
is inside, or a vote is in. Read aloud only shows state: start and stop your speech player from
`onPressedChange` and set `pressed` back when it ends.
