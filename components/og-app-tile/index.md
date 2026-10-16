---
title: OG App Tile
description: A 1200x630 card with the logo on a raised app tile and a soft glow, the name and description below, rendered to PNG with takumi.
component: og-app-tile
category: og-images
tags: [og, open graph, social card, app, icon]
---

Your logo sits on a white app tile lit by a soft `tone` glow; the name and a line of description fill the bottom of the card.

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
import OgAppTile from "#lib/components/og/og-app-tile/og-app-tile.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const { head, body } = render(OgAppTile, { props: { name: "Acme", logo: "https://acme.dev/logo.svg", description: "Ship your shortcuts." } });
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
import { OgAppTile } from "@/components/og/og-app-tile/og-app-tile";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgAppTile name="Acme" logo="https://acme.dev/logo.svg" description="Ship your shortcuts." />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the name and description as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
