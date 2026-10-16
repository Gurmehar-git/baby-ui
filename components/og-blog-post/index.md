---
title: OG Blog Post
description: A 1200x630 blog post card with publication, category, title, excerpt and byline, rendered to PNG with takumi.
component: og-blog-post
category: og-images
tags: [og, open graph, social card, blog]
---

A fixed 1200x630 canvas built from flex layout and your theme tokens, so it renders the same in
the browser and in [takumi](https://takumi.kane.tw).

- `default`: full-bleed hairlines, category with a `tone` dot, title, excerpt and byline.
- `cover`: a centred stack (mono wordmark, `category` as the lead line, title) over `cover`, faded in.
- `mode` picks a light or dark card regardless of the page theme. `cover` needs JetBrains Mono.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/blog/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgBlogPost from "#lib/components/og/og-blog-post/og-blog-post.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({
	families: [
		{ name: "Inter", weight: [400, 600, 700] },
		{ name: "JetBrains Mono", weight: [500] },
	],
});

export async function GET({ url }) {
	const { head, body } = render(OgBlogPost, {
		props: { title: url.searchParams.get("title") ?? "", site: "Acme" },
	});
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/blog/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgBlogPost } from "@/components/og/og-blog-post/og-blog-post";

const fonts = googleFonts({
	families: [
		{ name: "Inter", weight: [400, 600, 700] },
		{ name: "JetBrains Mono", weight: [500] },
	],
});

export async function GET(request: Request) {
	const title = new URL(request.url).searchParams.get("title") ?? "";
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(<OgBlogPost title={title} site="Acme" />, {
		width: 1200,
		height: 630,
		css,
		fonts: await fonts,
	});
}
```

Pass the same text as `og:image:alt`. Images (logo, avatar) must be absolute URLs.
