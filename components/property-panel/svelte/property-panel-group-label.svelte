<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import CollapsibleTrigger from "../../collapsible/svelte/collapsible-trigger.svelte";
import { cn } from "../../lib/cn";
import { propertyPanel } from "../variants";
import { getPropertyPanelGroup } from "./context";

let { class: classProp, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();

const group = getPropertyPanelGroup();
const s = propertyPanel();
</script>

{#if group.collapsible}
	<CollapsibleTrigger
		data-slot="property-panel-group-label"
		class={cn(s.label(), s.trigger(), classProp)}
	>
		{@render children?.()}
	</CollapsibleTrigger>
{:else}
	<div
		data-slot="property-panel-group-label"
		class={cn(s.label(), classProp)}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
