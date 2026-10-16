---
title: OG Paper Window
description: A 1200x630 card with a paper window, traffic lights and serif copy lying over artwork, rendered to PNG with takumi.
component: og-paper-window
category: og-images
tags: [og, open graph, social card, window, serif]
---

A paper window with traffic lights lies over your `image` and runs off the bottom edge. The `title` is set in the serif, so register a font under your `--font-serif` family when you render.

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
import OgPaperWindow from "#lib/components/og/og-paper-window/og-paper-window.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const { head, body } = render(OgPaperWindow, { props: { name: "Acme", title: "the notepad for every meeting", image: "https://acme.dev/og/art.jpg" } });
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
import { OgPaperWindow } from "@/components/og/og-paper-window/og-paper-window";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgPaperWindow name="Acme" title="the notepad for every meeting" image="https://acme.dev/og/art.jpg" />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the name and title as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
