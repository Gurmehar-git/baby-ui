---
title: OG Pricing
description: A 1200x630 pricing card with plan, big price, compare-at, up to four feature ticks and a most popular treatment.
component: og-pricing
category: og-images
tags: [og, open graph, social card, pricing, plan]
---

One plan, one big number. `price`, `period` and `compareAt` arrive pre-formatted, so the card never
guesses a currency. Passing `popular` adds the tone ring, glow and badge to the feature card.
Up to four features show; each clamps to two lines.
`mode` picks a light or dark card regardless of the page theme; `tone` sets the accent colour.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/pricing/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgPricing from "#lib/components/ui/og-pricing/og-pricing.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET({ url }) {
	const { head, body } = render(OgPricing, {
		props: { plan: url.searchParams.get("plan") ?? "", price: "$29", features: ["SSO"] },
	});
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/pricing/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgPricing } from "@/components/ui/og-pricing/og-pricing";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET(request: Request) {
	const plan = new URL(request.url).searchParams.get("plan") ?? "";
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgPricing plan={plan} price="$29" features={["SSO"]} />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the plan and price as `og:image:alt`. The logo must be an absolute URL.
