---
title: OG Hairlines
description: A 1200x630 card with a centred brand, title and description inside hairline guides that cross at the corners, rendered to PNG with takumi.
component: og-hairlines
category: og-images
tags: [og, open graph, social card, grid, hairline]
---

Four 1px guides frame a centred stack: brand, a bold title and one quiet line. The guides run edge to edge, so the corners read as a layout grid.

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
import OgHairlines from "#lib/components/og/og-hairlines/og-hairlines.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const { head, body } = render(OgHairlines, { props: { name: "Acme", title: "Templates that ship", description: "Built with Svelte and Tailwind CSS." } });
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
import { OgHairlines } from "@/components/og/og-hairlines/og-hairlines";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgHairlines name="Acme" title="Templates that ship" description="Built with React and Tailwind CSS." />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the title as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
