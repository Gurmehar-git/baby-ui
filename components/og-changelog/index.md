---
title: OG Changelog
description: A 1200x630 release card with version pill, date, headline and three marked highlights, rendered to PNG with takumi.
component: og-changelog
category: og-images
tags: [og, open graph, social card, changelog, release]
---

A fixed 1200x630 canvas built from flex layout and your theme tokens, so it renders the same in
the browser and in [takumi](https://takumi.kane.tw). A ticket stub holds the version and date;
the headline clamps to two lines and each highlight to two. Markers (`added`, `changed`, `fixed`,
`removed`) use the success, info, warning and destructive tokens. Only the first three
highlights render.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/release/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgChangelog from "#lib/components/og/og-changelog/og-changelog.svelte";
import { getRelease } from "#lib/changelog.js";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET({ url }) {
	const release = await getRelease(url.searchParams.get("v") ?? "");
	const { head, body } = render(OgChangelog, {
		props: { ...release, site: "Acme" },
	});
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/release/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgChangelog } from "@/components/og/og-changelog/og-changelog";
import { getRelease } from "@/lib/changelog";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET(request: Request) {
	const release = await getRelease(new URL(request.url).searchParams.get("v") ?? "");
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgChangelog {...release} site="Acme" />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

`getRelease` is yours: it returns `version`, `headline`, `date` (pre-formatted) and
`highlights`. Pass the version and headline as `og:image:alt`.
