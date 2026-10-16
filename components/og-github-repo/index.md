---
title: OG GitHub Repo
description: A 1200x630 repository card with owner, name, description, language, stats and a contributor stack, rendered to PNG with takumi.
component: og-github-repo
category: og-images
tags: [og, open graph, social card, github, repository]
---

A fixed 1200x630 canvas built from flex layout and your theme tokens, so it renders the same in
the browser and in [takumi](https://takumi.kane.tw). The name clamps to two lines, the
description to two. Counts arrive pre-formatted (`"12.4k"`), so the card never guesses a locale.
The activity grid is decoration, not repository data; `tone` colours it and the language dot.

## Render it to PNG

Register each font under the family name your `--font-*` tokens use; on a mismatch takumi
silently falls back to the first font and the PNG stops matching the page.

```bash
# pm: add takumi-js
```

```ts
// tab: Svelte
// src/routes/og/repo/+server.ts
import { render } from "svelte/server";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import OgGithubRepo from "#lib/components/og/og-github-repo/og-github-repo.svelte";
import css from "../../../app.css?inline";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });
const compact = new Intl.NumberFormat("en", { notation: "compact" });

export async function GET({ url, fetch }) {
	const repo = await (await fetch(`https://api.github.com/repos/${url.searchParams.get("repo")}`)).json();
	const { head, body } = render(OgGithubRepo, {
		props: {
			owner: repo.owner.login,
			name: repo.name,
			description: repo.description ?? undefined,
			avatar: repo.owner.avatar_url,
			language: repo.language ?? undefined,
			stars: compact.format(repo.stargazers_count),
			forks: compact.format(repo.forks_count),
			issues: compact.format(repo.open_issues_count),
		},
	});
	return new ImageResponse(head + body, { width: 1200, height: 630, css, fonts: await fonts });
}
```

```tsx
// tab: React
// app/og/repo/route.tsx
// Next.js has no inline CSS import: compile once with `npx @tailwindcss/cli -i app/globals.css -o og.css`.
import { readFile } from "node:fs/promises";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgGithubRepo } from "@/components/og/og-github-repo/og-github-repo";

const fonts = googleFonts({ families: [{ name: "Inter", weight: [400, 600, 700] }] });
const compact = new Intl.NumberFormat("en", { notation: "compact" });

export async function GET(request: Request) {
	const slug = new URL(request.url).searchParams.get("repo");
	const repo = await (await fetch(`https://api.github.com/repos/${slug}`)).json();
	const css = await readFile("og.css", "utf8");
	return new ImageResponse(
		<OgGithubRepo
			owner={repo.owner.login}
			name={repo.name}
			description={repo.description ?? undefined}
			avatar={repo.owner.avatar_url}
			language={repo.language ?? undefined}
			stars={compact.format(repo.stargazers_count)}
			forks={compact.format(repo.forks_count)}
			issues={compact.format(repo.open_issues_count)}
		/>,
		{ width: 1200, height: 630, css, fonts: await fonts },
	);
}
```

Pass `owner/name` as `og:image:alt`. Avatars must be absolute URLs.
