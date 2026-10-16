---
title: OG Editorial Bio
description: A 1200x630 personal card with your name and bio as staggered lines over one large tone circle, rendered to PNG with takumi.
component: og-editorial-bio
category: og-images
tags: [og, open graph, social card, personal, bio, portfolio]
---

A portfolio card set like a poster: the name flush left, then the bio one `lines` entry per line,
every other line indented. You choose the breaks, so the stagger never depends on font metrics.
Five lines fit under the name. `tone` colours the circle.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/about/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgEditorialBio from "#lib/components/og/og-editorial-bio/og-editorial-bio.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400] }] });
const lines = ["designs", "interfaces", "that move"];

export async function GET() {
	const { head, body } = render(OgEditorialBio, { props: { name: "Ada Park", lines } });
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/about/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgEditorialBio } from "@/components/og/og-editorial-bio/og-editorial-bio";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400] }] });
const lines = ["designs", "interfaces", "that move"];

export async function GET() {
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgEditorialBio name="Ada Park" lines={lines} />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the bio as one sentence in `og:image:alt`.
