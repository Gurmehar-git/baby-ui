<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
import { cn } from "../../lib/cn";
import { menu } from "../../lib/menu";
import { ANCHORED, stagger } from "../../lib/svelte/anchor";
import { dropdownMenuTrigger } from "./context";

let {
	class: classProp,
	sideOffset = 4,
	align = "start",
	ref = $bindable(null),
	...rest
}: DropdownMenuPrimitive.ContentProps = $props();

$effect(() => {
	if (ref) stagger(ref.querySelectorAll<HTMLElement>("[role='menuitem']"));
});
</script>

<DropdownMenuPrimitive.Portal>
	<DropdownMenuPrimitive.Content
		bind:ref
		{sideOffset}
		{align}
		aria-labelledby={dropdownMenuTrigger()}
		{...rest}
		data-slot="dropdown-menu-content"
		class={cn(ANCHORED, "static", menu().surface(), classProp)}
	/>
</DropdownMenuPrimitive.Portal>
