<script lang="ts">
import SpecDials from "@baby-ui/demos/controls";
import { IconAdjustmentsHorizontal, IconRefresh } from "@baby-ui/icons";
import type { ComponentSpec } from "@baby-ui/registry-schema";
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	ScrollArea,
} from "@baby-ui/svelte";
import { track } from "#lib/analytics.js";
import { defaultProps } from "#lib/registry.js";

let {
	spec,
	values = $bindable(),
	defaultOpen = false,
	docked = false,
}: {
	spec: ComponentSpec;
	values: Record<string, unknown>;
	/** Closed by default so a first visit sees the component, not a wall of dials. */
	defaultOpen?: boolean;
	/** Always open beside the preview, filling its column and scrolling on its own. */
	docked?: boolean;
} = $props();

// svelte-ignore state_referenced_locally
let open = $state(defaultOpen);
let resetKey = $state(0);

function reset() {
	values = defaultProps(spec);
	resetKey++;
}

// Debounced so a dragged slider reports once, when the reader settles on a value.
$effect(() => {
	const base = defaultProps(spec);
	const changed = Object.keys(values).filter(
		(key) => JSON.stringify(values[key]) !== JSON.stringify(base[key]),
	);
	if (!changed.length) return;
	const timer = setTimeout(() => track("props_changed", { props: changed }), 1500);
	return () => clearTimeout(timer);
});
</script>

{#if docked}
	<section aria-label="Controls" class="flex h-full min-h-0 flex-col rounded-2xl border border-border bg-background p-1">
		<div class="flex h-10 shrink-0 items-center justify-between gap-2 px-2.5">
			<p class="flex items-center gap-2 font-medium text-foreground text-sm">
				<IconAdjustmentsHorizontal size={16} class="text-muted-foreground" />
				Controls
			</p>
			<Button variant="ghost" size="xs" class="-mr-1" onclick={reset}>
				<IconRefresh />
				Reset
			</Button>
		</div>
		<ScrollArea
			scrollbar="hidden"
			maxHeight="none"
			class="min-h-0 flex-1 rounded-[11px] bg-card"
		>
			<div class="py-2">
			{#key `${spec.slug}:${resetKey}`}
				<SpecDials {spec} bind:values />
			{/key}
			</div>
		</ScrollArea>
	</section>
{:else}
<!-- The inset frame, same treatment as Card's `framed` variant and CodeBlock: a rim in
     bg-background around a bg-card body, so it reads as its own surface, not a plain box. -->
<Collapsible bind:open class="mt-4 rounded-2xl border border-border bg-background p-1">
	<div class="flex min-h-10 items-center justify-between gap-2 px-1.5">
		<CollapsibleTrigger class="min-h-8 flex-1 px-1.5 py-1">
			<IconAdjustmentsHorizontal size={16} class="text-muted-foreground" />
			Controls
		</CollapsibleTrigger>
		<Button variant="ghost" size="xs" onclick={reset}>
			<IconRefresh />
			Reset
		</Button>
	</div>
	<CollapsibleContent class="px-0 pb-0">
		<div class="rounded-[11px] bg-card py-2">
			{#key `${spec.slug}:${resetKey}`}
				<SpecDials {spec} bind:values />
			{/key}
		</div>
	</CollapsibleContent>
</Collapsible>
{/if}
