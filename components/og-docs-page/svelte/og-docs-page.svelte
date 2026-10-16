<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import {
	OG_DOCS_PAGE_BONES,
	type OgDocsPageMode,
	type OgDocsPageMotif,
	type OgDocsPageTone,
	ogDocsPage,
} from "./variants";

let {
	title,
	site,
	logo,
	description,
	section,
	snippet,
	filename,
	mode = "light",
	tone = "neutral",
	motif = "code",
	class: className,
}: {
	title: string;
	/** Docs site name shown top left. */
	site: string;
	logo?: string;
	description?: string;
	/** Breadcrumb trail above the title; the last entry is highlighted. */
	section?: string[];
	/** Code or shell lines for the window; placeholder bars render when omitted. */
	snippet?: string[];
	filename?: string;
	mode?: OgDocsPageMode;
	tone?: OgDocsPageTone;
	motif?: OgDocsPageMotif;
	class?: string;
} = $props();

const s = $derived(ogDocsPage({ mode, tone, motif }));
const crumbs = $derived(section ?? []);
const lines = $derived(snippet?.slice(0, 8));
const shell = $derived(motif === "terminal");
</script>

<div data-slot="og-docs-page" class={cn(s.root(), className)}>
	<div class={s.dots()}></div>
	<div class={s.column()}>
		<div class={s.brand()}>
			{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
			<span class={s.site()}>{site}</span>
		</div>
		{#if crumbs.length}
			<div class={s.crumbs()}>
				{#each crumbs as crumb, i (`${i}-${crumb}`)}
					<span class="flex items-center gap-3">
						{#if i > 0}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class={s.chevron()}
								aria-hidden="true"
							>
								<path d="m9 6 6 6-6 6" />
							</svg>
						{/if}
						<span class={i === crumbs.length - 1 ? s.crumbCurrent() : s.crumb()}>{crumb}</span>
					</span>
				{/each}
			</div>
		{/if}
		<h1 class={cn(s.title(), !crumbs.length && "mt-auto")}>{title}</h1>
		{#if description}<p class={s.description()}>{description}</p>{/if}
	</div>
	<div class={s.window()}>
		<div class={s.bar()}>
			<span class={s.light()}></span>
			<span class={s.light()}></span>
			<span class={s.light()}></span>
			{#if filename}<span class={s.filename()}>{filename}</span>{/if}
		</div>
		<div class={s.lines()}>
			{#if lines}
				{#each lines as line, i (`${i}-${line}`)}
					{@const command = shell && line.startsWith("$ ")}
					{@const muted = shell ? !command : /^\s*(\/\/|#)/.test(line)}
					<div class={s.line()}>
						<span class={s.gutter()}>{i + 1}</span>
						{#if command}<span class={s.prompt()}>$</span>{/if}
						<span class={muted ? s.comment() : s.code()}>{command ? line.slice(2) : line || " "}</span>
					</div>
				{/each}
			{:else}
				{#each OG_DOCS_PAGE_BONES as width, i (width)}
					<div class={cn(s.line(), "h-[33.6px]")}>
						<span class={s.gutter()}>{i + 1}</span>
						{#if shell && i % 3 === 0}<span class={s.prompt()}>$</span>{/if}
						{#if i % 3 === 0}<span class={s.boneAccent()}></span>{/if}
						<span class={s.bone()} style="width: {width}px"></span>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
