<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from "bits-ui";
import { cn } from "../../lib/cn";
import { type MenuSize, menu } from "../../lib/menu";
import { ANCHORED, stagger } from "../../lib/svelte/anchor";

let {
	class: classProp,
	size = "default",
	ref = $bindable(null),
	...rest
}: ContextMenuPrimitive.ContentProps & { size?: MenuSize } = $props();

$effect(() => {
	if (ref) stagger(ref.querySelectorAll<HTMLElement>("[role='menuitem']"));
});
</script>

<ContextMenuPrimitive.Portal>
	<ContextMenuPrimitive.Content
		bind:ref
		{...rest}
		data-slot="context-menu-content"
		data-size={size}
		class={cn(ANCHORED, "static", menu({ size }).surface(), classProp)}
	/>
</ContextMenuPrimitive.Portal>
