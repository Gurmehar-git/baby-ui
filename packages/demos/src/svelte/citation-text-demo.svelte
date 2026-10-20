<script lang="ts">
import {
	type CitationChip,
	CitationText,
	CitationTextBody,
	CitationTextSources,
} from "@baby-ui/svelte";
import { TLS_ANSWER, TLS_SOURCES } from "../data/citation-text";

let { props = {} }: { props?: Record<string, unknown> } = $props();
</script>

<div class="w-full max-w-xl text-[15px]">
	<CitationText
		segments={TLS_ANSWER}
		sources={TLS_SOURCES}
		chip={(props.chip as CitationChip) ?? "number"}
	>
		<CitationTextBody />
		{#if props.showSources !== false}
			<CitationTextSources label={(props.sourcesLabel as string) || "Sources"} />
		{/if}
	</CitationText>
</div>
