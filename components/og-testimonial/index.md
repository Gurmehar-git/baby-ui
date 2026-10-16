---
title: OG Testimonial
description: A 1200x630 customer quote card with a large quote mark, the quote as the hero and the author row below, rendered to PNG with takumi.
component: og-testimonial
category: og-images
tags: [og, open graph, social card, testimonial, quote]
---

A fixed 1200x630 canvas built from flex layout and your theme tokens, so it renders the same in
the browser and in [takumi](https://takumi.kane.tw). The quote is the focal point and clamps to four
lines; small stars show top right only when `rating` is set. `mode` picks a light or dark card, `tone`
colours only the large quote mark so the canvas stays plain, and `align` sets left or centred text.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/quote/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgTestimonial from "#lib/components/ui/og-testimonial/og-testimonial.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET({ url }) {
	const { head, body } = render(OgTestimonial, {
		props: { quote: url.searchParams.get("quote") ?? "", author: { name: url.searchParams.get("name") ?? "" } },
	});
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/quote/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgTestimonial } from "@/components/ui/og-testimonial/og-testimonial";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET(request: Request) {
	const q = new URL(request.url).searchParams;
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgTestimonial quote={q.get("quote") ?? ""} author={{ name: q.get("name") ?? "" }} />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the quote and author as `og:image:alt`. Images (avatar, company logo) must be absolute URLs.
