<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from "bits-ui";
import { ANCHORED, stagger } from "../../lib/svelte/anchor";
import { cn } from "../../lib/svelte/cn";
import { menu } from "../../lib/svelte/menu";

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
