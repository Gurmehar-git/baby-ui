---
title: OG Podcast Episode
description: A 1200x630 podcast episode card with cover art on a record sleeve, show, episode, title, guest and a waveform player, rendered to PNG with takumi.
component: og-podcast-episode
category: og-images
tags: [og, open graph, social card, podcast]
---

A fixed 1200x630 canvas built from flex layout and your theme tokens, so it renders the same in
the browser and in [takumi](https://takumi.kane.tw). Title clamps to three lines. Pass `peaks` (0 to 1)
for a real waveform; otherwise a static motif is drawn. `mode` picks a light or dark card, `tone`
colours the glow, record label and player, `layout` puts the cover left or right.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/podcast/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgPodcastEpisode from "#lib/components/ui/og-podcast-episode/og-podcast-episode.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET({ url }) {
	const { head, body } = render(OgPodcastEpisode, {
		props: { title: url.searchParams.get("title") ?? "", show: "Tokens and Tea", episode: url.searchParams.get("ep") ?? undefined },
	});
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/podcast/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgPodcastEpisode } from "@/components/ui/og-podcast-episode/og-podcast-episode";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET(request: Request) {
	const q = new URL(request.url).searchParams;
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgPodcastEpisode title={q.get("title") ?? ""} show="Tokens and Tea" episode={q.get("ep") ?? undefined} />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the show and title as `og:image:alt`. Images (cover, guest avatar) must be absolute URLs.
