---
title: OG CTA Pill
description: A 1200x630 card with one huge call-to-action pill on a grained colour field, lit from below, rendered to PNG with takumi.
component: og-cta-pill
category: og-images
tags: [og, open graph, social card, cta, glow]
---

One button-shaped promise and nothing else. `tone` picks the field; the pill ink and the warm glow are mixed from the same hue, and a fine dot screen gives the field its grain.

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
import OgCtaPill from "#lib/components/og/og-cta-pill/og-cta-pill.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const { head, body } = render(OgCtaPill, { props: { label: "Start building", logo: "https://acme.dev/mark-white.svg" } });
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
import { OgCtaPill } from "@/components/og/og-cta-pill/og-cta-pill";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgCtaPill label="Start building" logo="https://acme.dev/mark-white.svg" />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the label and brand as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
