<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import {
	type CitationSegment,
	type CitationSource,
	numberCitations,
} from "../citation-core";
import { type CitationChip, citationText } from "../variants";
import { type CitationActive, setCitationText } from "./context";

let {
	segments,
	sources,
	chip = "number",
	onActiveSourceChange,
	class: className,
	children,
}: {
	/** The answer, one entry per sentence or clause; append entries as the answer streams. */
	segments: CitationSegment[];
	sources: CitationSource[];
	/** Chips read as a number, or as the source's site name. */
	chip?: CitationChip;
	/** Fires with the source under the pointer or focus, null when it leaves. */
	onActiveSourceChange?: (id: string | null) => void;
	class?: string;
	children?: Snippet;
} = $props();

const styles = $derived(citationText({ chip }));
const numbered = $derived(numberCitations(segments, sources));
let active = $state<CitationActive>({ segment: null, source: null });

setCitationText({
	get segments() {
		return segments;
	},
	get numbered() {
		return numbered;
	},
	get chip() {
		return chip;
	},
	get active() {
		return active;
	},
	activate: (segment, source) => {
		active = { segment, source };
		onActiveSourceChange?.(source);
	},
	get styles() {
		return styles;
	},
});
</script>

<!-- The root: the answer, its sources and which one is under the pointer. Compose the body and sources inside. -->
<div data-slot="citation-text" class={cn(styles.root(), className)}>{@render children?.()}</div>
