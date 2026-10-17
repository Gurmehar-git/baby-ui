<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from "bits-ui";
import { cn } from "../../lib/cn";
import { menu } from "../../lib/menu";
import { ANCHORED, stagger } from "../../lib/svelte/anchor";

let {
	class: classProp,
	ref = $bindable(null),
	...rest
}: ContextMenuPrimitive.ContentProps = $props();

$effect(() => {
	if (ref) stagger(ref.querySelectorAll<HTMLElement>("[role='menuitem']"));
});
</script>

<ContextMenuPrimitive.Portal>
	<ContextMenuPrimitive.Content
		bind:ref
		{...rest}
		data-slot="context-menu-content"
		class={cn(ANCHORED, "static", menu().surface(), classProp)}
	/>
</ContextMenuPrimitive.Portal>
