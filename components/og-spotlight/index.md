---
title: OG Spotlight
description: A 1200x630 card with a centred headline and brand on a faint grid, ringed by portrait tiles, rendered to PNG with takumi.
component: og-spotlight
category: og-images
tags: [og, open graph, social card, headline, team, portraits]
---

Eight portrait tiles hug the side edges, four a side, so the headline keeps a clear 600px column;
the brand sits under it in muted type. Good for team, hiring, agent or community pages. `images`
repeat to fill the slots.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/team/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgSpotlight from "#lib/components/og/og-spotlight/og-spotlight.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 500] }] });
const images = ["https://acme.dev/team/1.png", "https://acme.dev/team/2.png"];

export async function GET({ url }) {
	const { head, body } = render(OgSpotlight, {
		props: { title: url.searchParams.get("title") ?? "", site: "Acme", images },
	});
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/team/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgSpotlight } from "@/components/og/og-spotlight/og-spotlight";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 500] }] });
const images = ["https://acme.dev/team/1.png", "https://acme.dev/team/2.png"];

export async function GET(request: Request) {
	const title = new URL(request.url).searchParams.get("title") ?? "";
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgSpotlight title={title} site="Acme" images={images} />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the headline as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
