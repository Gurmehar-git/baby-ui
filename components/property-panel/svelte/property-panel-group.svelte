<script lang="ts">
import { Collapsible as CollapsiblePrimitive } from "bits-ui";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { setPropertyPanelGroup } from "./context";
import { propertyPanel } from "./variants";

type Props = Omit<HTMLAttributes<HTMLDivElement>, "id"> & {
	id?: string;
	/** Turns the label into a toggle with a chevron; the content animates its height. */
	collapsible?: boolean;
	/** Open state when `collapsible`. Bindable. */
	open?: boolean;
};

let {
	class: classProp,
	collapsible = false,
	open = $bindable(true),
	children,
	...rest
}: Props = $props();

setPropertyPanelGroup({
	get collapsible() {
		return collapsible;
	},
});
</script>

{#if collapsible}
	<CollapsiblePrimitive.Root
		bind:open
		data-slot="property-panel-group"
		class={cn(propertyPanel().group(), classProp)}
		{...rest}
	>
		{@render children?.()}
	</CollapsiblePrimitive.Root>
{:else}
	<div data-slot="property-panel-group" class={cn(propertyPanel().group(), classProp)} {...rest}>
		{@render children?.()}
	</div>
{/if}
