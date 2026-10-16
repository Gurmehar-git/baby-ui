---
title: OG Showcase
description: A 1200x630 product card with a big headline bottom left and two offset columns of framed screenshots, rendered to PNG with takumi.
component: og-showcase
category: og-images
tags: [og, open graph, social card, product, screenshots]
---

The headline runs up to four lines on the left; two columns of framed shots bleed off the top and
bottom on the right, offset so they read as a scroll. Six `images` fill the frames and repeat if
you pass fewer. Phone-ratio screenshots look best.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/product/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgShowcase from "#lib/components/og/og-showcase/og-showcase.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600] }] });
const images = ["https://acme.dev/og/a.png", "https://acme.dev/og/b.png"];

export async function GET({ url }) {
	const { head, body } = render(OgShowcase, {
		props: { title: url.searchParams.get("title") ?? "", images },
	});
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/product/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgShowcase } from "@/components/og/og-showcase/og-showcase";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600] }] });
const images = ["https://acme.dev/og/a.png", "https://acme.dev/og/b.png"];

export async function GET(request: Request) {
	const title = new URL(request.url).searchParams.get("title") ?? "";
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgShowcase title={title} images={images} />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the headline as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
