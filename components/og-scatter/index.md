---
title: OG Scatter
description: A 1200x630 brand card with the wordmark in a clearing ringed by rounded image tiles, rendered to PNG with takumi.
component: og-scatter
category: og-images
tags: [og, open graph, social card, brand, collage, images]
---

Seven rounded tiles sit at fixed slots around the edges and keep the centre clear for the mark;
three of them blur slightly so the card has depth. `images` repeat to fill the slots, so three
screenshots are enough.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/brand/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgScatter from "#lib/components/og/og-scatter/og-scatter.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600] }] });
const images = ["https://acme.dev/og/1.png", "https://acme.dev/og/2.png"];

export async function GET() {
	const { head, body } = render(OgScatter, { props: { name: "Acme", images } });
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/brand/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgScatter } from "@/components/og/og-scatter/og-scatter";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600] }] });
const images = ["https://acme.dev/og/1.png", "https://acme.dev/og/2.png"];

export async function GET() {
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgScatter name="Acme" images={images} />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the brand name as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
