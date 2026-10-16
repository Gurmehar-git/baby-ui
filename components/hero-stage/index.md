---
title: Hero Stage
description: "A tilted stage of cards that start scattered over dashed slots and settle into place as the page scrolls."
component: hero-stage
category: blocks
tags: [hero, landing, scroll, parallax, dashboard, marketing, stage]
---

The dashboard in this site's hero, as a component. Wrap any layout in `HeroStage` and put
each card in a `HeroStageSlot`; the slot draws the dashed outline the card settles onto.

`x`, `y` and `rotate` set where a card starts. The first half screen of page scroll moves it
home and untilts the stage, all in CSS scroll timelines, so nothing runs on the main thread.
Place it near the top of the page: the timeline is the root scroller.

To replay the entrance, remount the stage, e.g. by changing its `key`.
