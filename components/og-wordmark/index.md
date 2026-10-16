---
title: OG Wordmark
description: A 1200x630 brand card with nothing but the logo and wordmark on a plain field, rendered to PNG with takumi.
component: og-wordmark
category: og-images
tags: [og, open graph, social card, brand, logo, wordmark]
---

The quietest card: logo and name, centred, nothing else. `mode` picks the field; an optional
`tagline` sits under the mark.

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
import OgWordmark from "#lib/components/og/og-wordmark/og-wordmark.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600] }] });

export async function GET() {
	const { head, body } = render(OgWordmark, { props: { name: "Acme", mode: "dark" } });
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
import { OgWordmark } from "@/components/og/og-wordmark/og-wordmark";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600] }] });

export async function GET() {
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgWordmark name="Acme" mode="dark" />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the brand name as `og:image:alt`. The logo must be an absolute PNG, SVG or WebP URL; an
`.ico` fails the whole render.
