---
title: Music Player
description: A record-deck player with the cover as a spinning vinyl disc, seek, transport and volume controls.
component: music-player
category: blocks
tags: [music, audio, player, vinyl, media]
---

`playing`, `position` and `volume` are controlled: `bind:` them in Svelte, or pair each with its
`default*` and `on*Change` props in React. Without `src` the player only renders, so wire it to any
audio engine you already have.

Pass `src` and it drives a hidden `<audio>` element instead, reporting the playhead back through
`position`. Skip buttons appear only when `onPrevious` or `onNext` is set.
