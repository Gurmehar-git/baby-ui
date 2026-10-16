---
title: OG Product Launch
description: A 1200x630 launch card with a filled badge, product name, tagline and a floating screenshot on a tone gradient.
component: og-product-launch
category: og-images
tags: [og, open graph, social card, launch, product]
---

A launch hero for release day. The screenshot floats as a large rounded shot with a soft shadow,
bleeding off the canvas so it reads large even as a thumbnail; `layout` puts it beside the text
(`split`) or under it (`stacked`, which drops the brand and URL). Name and tagline clamp to two
lines (one each when stacked). `mode` picks a light or dark card regardless of the page theme;
`tone` colours the gradient and badge.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/launch/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgProductLaunch from "#lib/components/ui/og-product-launch/og-product-launch.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET({ url }) {
	const { head, body } = render(OgProductLaunch, {
		props: { name: url.searchParams.get("name") ?? "", badge: "Now available", url: "acme.dev" },
	});
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/launch/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgProductLaunch } from "@/components/ui/og-product-launch/og-product-launch";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET(request: Request) {
	const name = new URL(request.url).searchParams.get("name") ?? "";
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgProductLaunch name={name} badge="Now available" url="acme.dev" />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the product name as `og:image:alt`. Images (screenshot, logo) must be absolute URLs.
