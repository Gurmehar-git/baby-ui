---
title: Agent Screen
description: "A live viewer for an agent's screen: a resting capture that expands to a full-width viewer."
component: agent-screen
category: agents
tags: [agent, screen, viewer, recording]
---

The resting card is a framed capture of the agent's screen; hover reveals an "Open" pill.
Opening it expands to a full-width viewer with "Teach a task" (starts a recording timer)
and a collapse control, built on the real `Dialog`, so focus trap, scroll lock and
outside-dismiss all come from that primitive.

## Recording survives collapsing the viewer

The elapsed-time state lives on `AgentScreen` itself, not inside the dialog's content, so
starting a recording and collapsing the viewer keeps the timer ticking in the background.

## No fictional default

`streamSrc` has no built-in sample: pass an image or video URL, or leave it unset for a
plain "Screen unavailable" placeholder rather than a fake decorative browser mockup.
