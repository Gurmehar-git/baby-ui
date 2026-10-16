---
title: OG Halo
description: A 1200x630 card with one mark centred in a soft halo of light, rendered to PNG with takumi.
component: og-halo
category: og-images
tags: [og, open graph, social card, logo, glow]
---

A mark and a light behind it, nothing else. A dark mark on the dark card reads as a silhouette against the halo; `tone` colours the light.

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
import OgHalo from "#lib/components/og/og-halo/og-halo.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const { head, body } = render(OgHalo, { props: { logo: "https://acme.dev/mark.svg" } });
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
import { OgHalo } from "@/components/og/og-halo/og-halo";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgHalo logo="https://acme.dev/mark.svg" />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

The card has no text: pass the brand name as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
