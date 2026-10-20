<script lang="ts">
import { cn } from "../../lib/cn";
import { hubPositions } from "../animated-beam-core";
import { type AnimatedBeamNode, animatedBeamState } from "./context";

let {
	showLabels = false,
	label = "Integrations",
	class: className,
}: {
	/** Show each node's label under its mark; otherwise labels are for screen readers only. */
	showLabels?: boolean;
	/** Accessible name of the node list. */
	label?: string;
	class?: string;
} = $props();

const ctx = animatedBeamState("AnimatedBeamNodes");
const positions = $derived(hubPositions(ctx.satellites.length));

// Labels move node centres in a row, so beams re-measure when they toggle.
$effect(() => {
	void showLabels;
	ctx.measure();
});
</script>

{#snippet mark(node: AnimatedBeamNode, isCenter: boolean)}
	<div data-beam-node={node.id} class={isCenter ? ctx.styles.center() : ctx.styles.node()}>
		{#if node.icon}
			{@render node.icon()}
		{:else if node.src}
			<img src={node.src} alt="" draggable="false" class={ctx.styles.icon()} />
		{/if}
	</div>
	<span class={showLabels ? ctx.styles.label() : "sr-only"}>{node.label}</span>
{/snippet}

<!-- The nodes as a labelled list: the hub in the middle (or at the end of a row). -->
<ul aria-label={label} data-slot="animated-beam-nodes" class={cn(ctx.styles.list(), className)}>
	{#if ctx.layout === "hub"}
		{#if ctx.hub}
			<li class={ctx.styles.hubItem()}>{@render mark(ctx.hub, true)}</li>
		{/if}
		{#each ctx.satellites as node, i (node.id)}
			<li
				class={ctx.styles.satelliteItem()}
				style:left="{positions[i]?.x ?? 50}%"
				style:top="{positions[i]?.y ?? 50}%"
			>
				{@render mark(node, false)}
			</li>
		{/each}
	{:else}
		{#each ctx.satellites as node, i (node.id)}
			<li class={ctx.styles.satelliteItem()} style:grid-row={i + 1}>
				{@render mark(node, false)}
			</li>
		{/each}
		{#if ctx.hub}
			<li
				class={ctx.styles.hubItem()}
				style:grid-row="1 / span {Math.max(1, ctx.satellites.length)}"
			>
				{@render mark(ctx.hub, true)}
			</li>
		{/if}
	{/if}
</ul>
