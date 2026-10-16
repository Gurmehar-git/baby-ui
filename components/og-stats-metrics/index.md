---
title: OG Stats Metrics
description: A 1200x630 metrics card led by one huge number, a headline and a soft area chart, rendered to PNG with takumi.
component: og-stats-metrics
category: og-images
tags: [og, open graph, social card, stats, metrics]
---

A fixed 1200x630 canvas built from flex layout and your theme tokens, so it renders the same in
the browser and in [takumi](https://takumi.kane.tw). The first entry in `stats` is the hero: its
value prints huge with a delta chip coloured by `trend`; the next two print as one plain line.
Headline clamps to two lines. `sparkline` takes raw numbers and draws a soft area chart off the
bottom right corner. `mode` picks a light or dark card, `tone` colours the chart and hero label.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/stats/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgStatsMetrics from "#lib/components/ui/og-stats-metrics/og-stats-metrics.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET({ url }) {
	const { head, body } = render(OgStatsMetrics, {
		props: { headline: url.searchParams.get("headline") ?? "", stats: await loadStats() },
	});
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/stats/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgStatsMetrics } from "@/components/ui/og-stats-metrics/og-stats-metrics";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET(request: Request) {
	const q = new URL(request.url).searchParams;
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgStatsMetrics headline={q.get("headline") ?? ""} stats={await loadStats()} />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

`loadStats` stands for your own data source: stats and sparkline values are too long for a query string, so load them on the server. Name the key numbers in `og:image:alt`.
