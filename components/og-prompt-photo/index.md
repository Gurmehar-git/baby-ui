---
title: OG Prompt Photo
description: A 1200x630 card with a headline and an AI prompt box with option chips over a photo, rendered to PNG with takumi.
component: og-prompt-photo
category: og-images
tags: [og, open graph, social card, ai, prompt, photo]
---

A white headline and a prompt box with option `chips` sit over a full-bleed photo. Pick a calm sky or texture so the title reads; `mode` only changes the box.

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
import OgPromptPhoto from "#lib/components/og/og-prompt-photo/og-prompt-photo.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const { head, body } = render(OgPromptPhoto, { props: { title: "Build pages with AI", placeholder: "A landing page for a voice agent", image: "https://acme.dev/og/sky.jpg" } });
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
import { OgPromptPhoto } from "@/components/og/og-prompt-photo/og-prompt-photo";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET() {
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgPromptPhoto title="Build pages with AI" placeholder="A landing page for a voice agent" image="https://acme.dev/og/sky.jpg" />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the title as `og:image:alt`. Images must be absolute PNG, SVG or WebP URLs.
