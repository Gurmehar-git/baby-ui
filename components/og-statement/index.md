---
title: OG Statement
description: A 1200x630 card with a mark top left and one large statement bottom left, rendered to PNG with takumi.
component: og-statement
category: og-images
tags: [og, open graph, social card, statement, headline]
---

One sentence carries the card. The mark sits top left, the statement wraps to three lines bottom left, and nothing else competes with it.

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
import OgStatement from "#lib/components/og/og-statement/og-statement.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const { head, body } = render(OgStatement, { props: { title: "Ship the feedback loop", logo: "https://acme.dev/mark.svg" } });
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
import { OgStatement } from "@/components/og/og-statement/og-statement";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgStatement title="Ship the feedback loop" logo="https://acme.dev/mark.svg" />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the statement as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
