---
title: OG Split
description: A 1200x630 brand card with the wordmark on the left and an image panel with a curved edge on the right, rendered to PNG with takumi.
component: og-split
category: og-images
tags: [og, open graph, social card, brand, split, image]
---

The mark takes the left 40% and one `image` fills the right, its left edge curved at half the
canvas height. Works best with a photo or artwork that has no text of its own; the tagline wraps
to two lines under the name.

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
import OgSplit from "#lib/components/og/og-split/og-split.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600] }] });

export async function GET() {
	const { head, body } = render(OgSplit, {
		props: { name: "Acme", image: "https://acme.dev/og/hero.png" },
	});
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
import { OgSplit } from "@/components/og/og-split/og-split";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600] }] });

export async function GET() {
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgSplit name="Acme" image="https://acme.dev/og/hero.png" />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the brand name as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
