---
title: Status Monitor
description: "Uptime strip: one bar per day or hour, coloured by status, with a tooltip per period and the uptime share."
component: status-monitor
category: blocks
tags: [status, uptime, monitor, incident, health, timeline, sla]
---

Pass one entry per period, oldest first. The strip shows the newest 90, 60 or 30, whichever
fits, and pads missing periods as no data. Uptime counts only recorded periods.

The strip is one tab stop: arrow keys move between bars and open each tooltip. Composes
`tooltip`.
