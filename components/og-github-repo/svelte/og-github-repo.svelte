<script lang="ts">
import { cn } from "../../lib/cn";
import {
	OG_GITHUB_REPO_ICONS,
	OG_GITHUB_REPO_WEEKS,
	type OgGithubRepoMode,
	type OgGithubRepoTone,
	ogGithubRepo,
	ogGithubRepoCell,
} from "../variants";

let {
	owner,
	name,
	description,
	avatar,
	language,
	stars,
	forks,
	issues,
	contributors,
	contributorCount,
	mode = "light",
	tone = "chart",
	class: className,
}: {
	owner: string;
	/** Repository name, the focal line. */
	name: string;
	description?: string;
	/** Owner avatar URL. */
	avatar?: string;
	language?: string;
	/** Pre-formatted counts, e.g. "12.4k". */
	stars?: string;
	forks?: string;
	issues?: string;
	/** Contributor avatar URLs; the first five are stacked. */
	contributors?: string[];
	/** Pre-formatted overflow chip, e.g. "+128". */
	contributorCount?: string;
	mode?: OgGithubRepoMode;
	tone?: OgGithubRepoTone;
	class?: string;
} = $props();

const s = $derived(ogGithubRepo({ mode, tone }));
const stats = $derived(
	(["stars", "forks", "issues"] as const)
		.map((key) => ({ key, value: { stars, forks, issues }[key] }))
		.filter((stat) => stat.value),
);
const faces = $derived(contributors?.slice(0, 5) ?? []);
const crew = $derived(faces.length > 0 || Boolean(contributorCount));
</script>

<div data-slot="og-github-repo" class={cn(s.root(), className)}>
	<div class={s.heatmap()}>
		{#each OG_GITHUB_REPO_WEEKS as week, w (`w${w}`)}
			<div class={s.week()}>
				{#each week as level, d (`d${d}`)}
					<span class={cn(s.cell(), ogGithubRepoCell({ level }))}></span>
				{/each}
			</div>
		{/each}
	</div>
	<div class={s.owner()}>
		{#if avatar}<img src={avatar} alt="" class={s.ownerAvatar()} />{/if}
		<span class={s.ownerName()}>{owner} /</span>
	</div>
	<h1 class={s.name()}>{name}</h1>
	{#if description}<p class={s.description()}>{description}</p>{/if}
	{#if language || stats.length || crew}
		<div class={s.footer()}>
			{#if language}
				<span class={s.language()}><span class={s.languageDot()}></span><span class={s.languageName()}>{language}</span></span>
			{/if}
			{#each stats as stat (stat.key)}
				<span class={s.stat()}>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class={s.icon()}
						aria-hidden="true"
					>
						{#each OG_GITHUB_REPO_ICONS[stat.key] as d (d)}<path {d} />{/each}
					</svg>{stat.value}</span>
			{/each}
			{#if crew}
				<span class={s.stack()}>
					{#each faces as src, i (`${i}-${src}`)}
						<img {src} alt="" class={cn(s.avatar(), i > 0 && s.overlap())} />
					{/each}
					{#if contributorCount}
						<span class={cn(s.more(), faces.length > 0 && s.overlap())}>{contributorCount}</span>
					{/if}
				</span>
			{/if}
		</div>
	{/if}
</div>
