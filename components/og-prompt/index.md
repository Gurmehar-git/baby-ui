---
title: OG Prompt
description: A 1200x630 card with a wordmark over a chat prompt box that rises out of a band of colour, rendered to PNG with takumi.
component: og-prompt
category: og-images
tags: [og, open graph, social card, ai, prompt]
---

For AI products: the wordmark and one line up top, and a prompt box with your `placeholder` already typed, cut by the bottom edge so it reads as the start of the product.

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
import OgPrompt from "#lib/components/og/og-prompt/og-prompt.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const { head, body } = render(OgPrompt, { props: { name: "Acme", placeholder: "Build me a dashboard", description: "Ship apps by chatting" } });
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
import { OgPrompt } from "@/components/og/og-prompt/og-prompt";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgPrompt name="Acme" placeholder="Build me a dashboard" description="Ship apps by chatting" />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the name and description as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
