<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
import { cn } from "../../lib/cn";
import { type MenuSize, menu } from "../../lib/menu";
import { ANCHORED } from "../../lib/svelte/anchor";

let {
	class: classProp,
	size = "default",
	...rest
}: DropdownMenuPrimitive.SubContentProps & { size?: MenuSize } = $props();
</script>

<DropdownMenuPrimitive.Portal>
	<DropdownMenuPrimitive.SubContent
		{...rest}
		data-slot="dropdown-menu-sub-content"
		data-size={size}
		class={cn(ANCHORED, "static min-w-40", menu({ size }).surface(), classProp)}
	/>
</DropdownMenuPrimitive.Portal>
