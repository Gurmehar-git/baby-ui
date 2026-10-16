---
title: OG Big Icon
description: A 1200x630 card with brand, title and body on the left and one huge icon cropped by the right edge over a faint icon pattern, rendered to PNG with takumi.
component: og-big-icon
category: og-images
tags: [og, open graph, social card, icons, icon library]
---

Made for icon sets and tools with a mascot: one `icon` fills the right side and runs off the edge, while an optional `pattern` of small icons tiles faintly behind the copy.

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
import OgBigIcon from "#lib/components/og/og-big-icon/og-big-icon.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const { head, body } = render(OgBigIcon, { props: { name: "Acme", title: "Icons for every screen", icon: "https://acme.dev/icons/ghost.svg" } });
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
import { OgBigIcon } from "@/components/og/og-big-icon/og-big-icon";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgBigIcon name="Acme" title="Icons for every screen" icon="https://acme.dev/icons/ghost.svg" />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the title as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
