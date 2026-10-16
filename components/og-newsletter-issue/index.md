---
title: OG Newsletter Issue
description: A 1200x630 editorial newsletter cover with a masthead, one large headline and up to three numbered stories, rendered to PNG with takumi.
component: og-newsletter-issue
category: og-images
tags: [og, open graph, social card, newsletter]
---

A fixed 1200x630 canvas built from flex layout and your theme tokens, so it renders the same in
the browser and in [takumi](https://takumi.kane.tw). A masthead sits over a single hairline rule,
the headline is the only focal point (three lines, or two when the list shows), and `inside` lists up
to three more stories, numbered. `mode` picks a light or dark card; `tone` colours only the issue
label and the list numbers, so the canvas stays plain.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/newsletter/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgNewsletterIssue from "#lib/components/og/og-newsletter-issue/og-newsletter-issue.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET({ url }) {
	const { head, body } = render(OgNewsletterIssue, {
		props: { publication: "Acme Weekly", headline: url.searchParams.get("headline") ?? "" },
	});
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/newsletter/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgNewsletterIssue } from "@/components/og/og-newsletter-issue/og-newsletter-issue";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });

export async function GET(request: Request) {
	const headline = new URL(request.url).searchParams.get("headline") ?? "";
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgNewsletterIssue publication="Acme Weekly" headline={headline} />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the headline as `og:image:alt`. The logo must be an absolute URL; issue and date arrive
pre-formatted.
