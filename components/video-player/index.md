---
title: Video Player
description: A composable video player on media-chrome with HLS, speed, quality and volume menus, and every playback value controllable.
component: video-player
category: base
tags: [video, player, media, playback, hls]
---

Compose it from parts: `VideoPlayerViewport` holds the `<video>` (`VideoPlayerContent`) and
anything layered over it; `VideoPlayerControlBar` holds the controls. Media-chrome does the
playback wiring, hotkeys and accessible names underneath.

## Anatomy

- `VideoPlayer`: root, framed by the Card variants. Owns `playing`, `currentTime`, `volume`,
  `muted`, `loop`, `playbackRate` and `quality`.
- `VideoPlayerViewport`: the video frame. Put `VideoPlayerContent`, the `lg` play button,
  `VideoPlayerLoadingIndicator` and `VideoPlayerError` inside it.
- `VideoPlayerControlBar`: goes after the viewport, not inside it, so each variant can place it
  under or over the video.
- Controls: `PlayButton`, `SeekBackwardButton`, `SeekForwardButton`, `TimeRange`, `TimeDisplay`,
  `MuteButton`, `Volume`, `PlaybackRate`, `Quality`, `LoopButton`, `PipButton`,
  `FullscreenButton`, each prefixed `VideoPlayer`.
- `VideoPlayerEndScreen`: your own call to action, banner or replay over the video. Opens
  `when` the video ends, before the first play (`idle`) or whenever paused; `open` overrides it.

## Streaming

An `.m3u8` source plays through hls.js, loaded only when a stream needs it; Safari uses its
native HLS. `VideoPlayerQuality` appears once the stream offers more than one rendition.

## Full media-chrome and hls.js access

Every part built on a media-chrome element forwards all of its props and attributes, so
`autohide`, `hotkeys`, `seekoffset` and the rest work as documented there. `VideoPlayerContent`
takes `hlsConfig` for hls.js and hands back the instance (`hlsRef` in React, `bind:hls` in
Svelte); the viewport `ref` is the media controller itself.

## Controlled state

`bind:` any playback value in Svelte, or pair it with its `default*` and `on*Change` props in
React. The video reports back through the same props, whichever control made the change.

## States

- Buffering: the spinner waits `loadingDelay` (500ms) so short stalls never flash it.
- Ended: play turns into replay.
- Failure: `VideoPlayerError` names the cause and retries; `onError` reports it.

## Captions

Pass `<track kind="captions">` children to `VideoPlayerContent`; the browser renders them.
