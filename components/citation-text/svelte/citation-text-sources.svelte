<script lang="ts">
import { cn } from "../../lib/cn";
import { siteName } from "../citation-core";
import Favicon from "./citation-text-favicon.svelte";
import { citationTextState } from "./context";

let { label = "Sources", class: className }: { label?: string; class?: string } =
	$props();

const ctx = citationTextState("CitationTextSources");
</script>

<!-- Every cited source, numbered in order of first citation; hovering one lights its clauses. -->
{#if ctx.numbered.cited.length > 0}
	<div class={cn(ctx.styles.sources(), className)}>
		<p class={ctx.styles.sourcesLabel()}>{label}</p>
		<ol class={ctx.styles.sourceList()}>
			{#each ctx.numbered.cited as cite (cite.id)}
				<li>
					<a
						href={cite.source.url}
						target="_blank"
						rel="noreferrer noopener"
						data-active={ctx.active.source === cite.id || undefined}
						class={ctx.styles.source()}
						onmouseenter={() => ctx.activate(null, cite.id)}
						onmouseleave={() => ctx.activate(null, null)}
						onfocus={() => ctx.activate(null, cite.id)}
						onblur={() => ctx.activate(null, null)}
					>
						<span class={ctx.styles.sourceNumber()}>{cite.number}</span>
						<Favicon source={cite.source} class={ctx.styles.favicon()} />
						<span class={ctx.styles.sourceTitle()}>{cite.source.title}</span>
						<span class={ctx.styles.sourceDomain()}>{siteName(cite.source.domain)}</span>
					</a>
				</li>
			{/each}
		</ol>
	</div>
{/if}
