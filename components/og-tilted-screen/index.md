---
title: OG Tilted Screen
description: A 1200x630 product card with a headline on the left and one screenshot tilted off the right edge over a soft glow, rendered to PNG with takumi.
component: og-tilted-screen
category: og-images
tags: [og, open graph, social card, product, screenshot]
---

One big screenshot leans off the right edge with a rotate and skew (the renderer has no 3D, so
the depth is faked in 2D), anchored top left so the start of your UI stays in view. `tone` colours
the glow behind it.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/product/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgTiltedScreen from "#lib/components/og/og-tilted-screen/og-tilted-screen.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600] }] });

export async function GET({ url }) {
	const { head, body } = render(OgTiltedScreen, {
		props: { title: url.searchParams.get("title") ?? "", image: "https://acme.dev/og/app.png" },
	});
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/product/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgTiltedScreen } from "@/components/og/og-tilted-screen/og-tilted-screen";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600] }] });

export async function GET(request: Request) {
	const title = new URL(request.url).searchParams.get("title") ?? "";
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(
		<OgTiltedScreen title={title} image="https://acme.dev/og/app.png" />,
		{ width: 1200, height: 630, css, fonts: await fonts },
	);
}
```

Pass the headline as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
