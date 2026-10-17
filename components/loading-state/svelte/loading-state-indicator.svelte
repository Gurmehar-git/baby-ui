<script lang="ts">
import { cn } from "../../lib/cn";
import { LOADING_PATTERNS } from "../variants";
import { loadingStateState } from "./context";

let { class: classProp }: { class?: string } = $props();
const loader = loadingStateState();
const pattern = $derived(LOADING_PATTERNS[loader.variant]);
</script>

<!-- The 3x3 pixel grid; reduced motion freezes it to its dim state. -->
<span data-slot="loading-state-indicator" aria-hidden="true" class={cn(loader.styles.indicator(), classProp)}>
	{#each pattern.delays as delay, index (index)}
		<span
			class={cn(loader.styles.cell(), delay !== null && "pixel-cell")}
			style={`opacity: ${delay === null ? 0.07 : 0.15}; ${delay === null ? "" : `animation-duration: ${pattern.duration}ms; animation-delay: ${delay}ms;`}`}
		></span>
	{/each}
</span>
