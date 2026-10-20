<script lang="ts">
import { type CitationSource, monogram } from "../citation-core";

let { source, class: className }: { source: CitationSource; class: string } = $props();
</script>

<!-- Internal: the source's favicon, or its initial when it has none. -->
<span aria-hidden="true" class={className}>
	{#if source.favicon}
		<img
			src={source.favicon}
			alt=""
			loading="lazy"
			referrerpolicy="no-referrer"
			class="size-full object-cover"
		/>
	{:else}
		{monogram(source)}
	{/if}
</span>
