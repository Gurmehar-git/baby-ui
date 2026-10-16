---
title: OG Job Posting
description: A 1200x630 hiring card with company logo, hiring pill, team, role title and a location, salary and contract strip.
component: og-job-posting
category: og-images
tags: [og, open graph, social card, job, hiring, careers]
---

A careers card: role title up front, the facts in one strip below it. `salary` arrives pre-formatted.
`remote` swaps the location pin for a globe; empty strip cells are dropped. The title clamps to two lines.
`mode` picks a light or dark card regardless of the page theme; `tone` sets the accent colour.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/job/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgJobPosting from "#lib/components/ui/og-job-posting/og-job-posting.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET({ url }) {
	const { head, body } = render(OgJobPosting, {
		props: { title: url.searchParams.get("title") ?? "", company: "Acme" },
	});
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/job/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgJobPosting } from "@/components/ui/og-job-posting/og-job-posting";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET(request: Request) {
	const title = new URL(request.url).searchParams.get("title") ?? "";
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgJobPosting title={title} company="Acme" />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the role and company as `og:image:alt`. The logo must be an absolute URL.
