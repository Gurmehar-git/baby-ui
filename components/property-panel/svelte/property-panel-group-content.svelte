<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import CollapsibleContent from "../../collapsible/svelte/collapsible-content.svelte";
import { cn } from "../../lib/cn";
import { propertyPanel } from "../variants";
import { getPropertyPanelGroup } from "./context";

let { class: classProp, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();

const group = getPropertyPanelGroup();
</script>

{#if group.collapsible}
	<CollapsibleContent
		data-slot="property-panel-group-content"
		class={cn(propertyPanel().content(), classProp)}
	>
		{@render children?.()}
	</CollapsibleContent>
{:else}
	<div
		data-slot="property-panel-group-content"
		class={cn(propertyPanel().content(), classProp)}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
