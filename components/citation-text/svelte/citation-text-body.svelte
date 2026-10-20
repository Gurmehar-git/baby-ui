<script lang="ts">
import { needsSpace, segmentActive } from "../citation-core";
import Chip from "./citation-text-chip.svelte";
import { citationTextState } from "./context";

let { class: className }: { class?: string } = $props();

const ctx = citationTextState("CitationTextBody");
</script>

<!-- The answer text with a chip after each cited clause; hovering a chip lights its clause. -->
<!-- Segments, chips and joining spaces stay on one line: markup whitespace would add gaps. -->
<p class={className}>{#each ctx.segments as segment, index (index)}{#if index > 0 && needsSpace(ctx.segments[index - 1]?.text ?? "", segment.text)}{" "}{/if}<span data-slot="citation-segment" data-active={segmentActive(ctx.numbered.refs, index, ctx.active) || undefined} class={ctx.styles.segment()}>{segment.text}</span>{#each ctx.numbered.refs[index] ?? [] as cite (cite.id)}<Chip {cite} {index} />{/each}{/each}</p>
