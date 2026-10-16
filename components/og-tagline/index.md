---
title: OG Tagline
description: A 1200x630 card with the brand over a centred two-line headline, the second line in an accent colour, rendered to PNG with takumi.
component: og-tagline
category: og-images
tags: [og, open graph, social card, brand, tagline]
---

A promise in two beats: `title` sets up, `accent` lands in the `tone` colour. Each line stays on one line, so keep both short.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/card/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgTagline from "#lib/components/og/og-tagline/og-tagline.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const { head, body } = render(OgTagline, { props: { name: "Acme", title: "Start in a minute", accent: "Grow for years" } });
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/card/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgTagline } from "@/components/og/og-tagline/og-tagline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgTagline name="Acme" title="Start in a minute" accent="Grow for years" />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass both headline lines as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
