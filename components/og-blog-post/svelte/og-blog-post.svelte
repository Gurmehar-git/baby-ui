<script lang="ts">
import { cn } from "../../lib/cn";
import {
	type OgBlogPostMode,
	type OgBlogPostTone,
	type OgBlogPostVariant,
	ogBlogPost,
} from "../variants";

let {
	title,
	site,
	logo,
	excerpt,
	category,
	cover,
	author,
	date,
	readingTime,
	mode = "light",
	tone = "neutral",
	variant = "default",
	class: className,
}: {
	title: string;
	/** Site or publication name; top left, or centred above the title in `cover`. */
	site: string;
	logo?: string;
	excerpt?: string;
	/** Top right in `default`; the muted lead line over the title in `cover`. */
	category?: string;
	/** Image URL faded in under the text in `cover`. */
	cover?: string;
	author?: { name: string; avatar?: string };
	date?: string;
	readingTime?: string;
	mode?: OgBlogPostMode;
	tone?: OgBlogPostTone;
	variant?: OgBlogPostVariant;
	class?: string;
} = $props();

const s = $derived(ogBlogPost({ mode, tone, variant }));
const meta = $derived([date, readingTime].filter(Boolean) as string[]);
const centred = $derived(variant === "cover");
</script>

<div data-slot="og-blog-post" class={cn(s.root(), className)}>
	{#if centred}
		{#if cover}<img src={cover} alt="" class={s.cover()} />{/if}
	{:else}
		<div class={s.ruleTop()}></div>
		<div class={s.ruleBottom()}></div>
		<div class={s.ruleLeft()}></div>
		<div class={s.ruleRight()}></div>
	{/if}
	<div class={s.header()}>
		<div class={s.brand()}>
			{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
			<span>{site}</span>
		</div>
		{#if category && !centred}
			<span class={s.category()}>
				<span class={s.dot()}></span>
				{category}
			</span>
		{/if}
	</div>
	<div class={s.body()}>
		{#if category && centred}<p class={s.lead()}>{category}</p>{/if}
		<h1 class={s.title()}>{title}</h1>
		{#if excerpt}<p class={s.excerpt()}>{excerpt}</p>{/if}
	</div>
	{#if !centred && (author || meta.length)}
		<div class={s.footer()}>
			{#if author?.avatar}<img src={author.avatar} alt="" class={s.avatar()} />{/if}
			{#if author}<span class={s.author()}>{author.name}</span>{/if}
			{#each meta as item (item)}
				<span class="flex items-center gap-5">
					<span class={s.sep()}></span>
					<span class={s.meta()}>{item}</span>
				</span>
			{/each}
		</div>
	{/if}
</div>
