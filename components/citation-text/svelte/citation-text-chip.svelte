<script lang="ts">
import HoverCard from "../../hover-card/svelte/hover-card.svelte";
import HoverCardContent from "../../hover-card/svelte/hover-card-content.svelte";
import HoverCardTrigger from "../../hover-card/svelte/hover-card-trigger.svelte";
import { type CitationRef, siteName } from "../citation-core";
import Favicon from "./citation-text-favicon.svelte";
import { citationTextState } from "./context";

let { cite, index }: { cite: CitationRef; index: number } = $props();

const ctx = citationTextState("CitationTextBody");
</script>

<!-- Internal: one citation chip with its hover card. -->
<HoverCard>
	<HoverCardTrigger
		href={cite.source.url}
		target="_blank"
		rel="noreferrer noopener"
		aria-label="Source {cite.number}: {cite.source.title}"
		data-slot="citation-chip"
		class={ctx.styles.chip()}
		onmouseenter={() => ctx.activate(index, cite.id)}
		onmouseleave={() => ctx.activate(null, null)}
		onfocus={() => ctx.activate(index, cite.id)}
		onblur={() => ctx.activate(null, null)}
	>
		{ctx.chip === "domain" ? siteName(cite.source.domain) : cite.number}
	</HoverCardTrigger>
	<HoverCardContent class={ctx.styles.card()}>
		<div class={ctx.styles.cardHead()}>
			<Favicon source={cite.source} class={ctx.styles.favicon()} />
			<span class="truncate">{cite.source.domain}</span>
		</div>
		<p class={ctx.styles.cardTitle()}>{cite.source.title}</p>
		{#if cite.source.snippet}
			<p class={ctx.styles.cardSnippet()}>{cite.source.snippet}</p>
		{/if}
		<a href={cite.source.url} target="_blank" rel="noreferrer noopener" class={ctx.styles.cardLink()}>
			Open source
		</a>
	</HoverCardContent>
</HoverCard>
