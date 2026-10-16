<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
import { ANCHORED } from "../../lib/svelte/anchor";
import { cn } from "../../lib/svelte/cn";
import { menu } from "../../lib/svelte/menu";

let { class: classProp, ...rest }: DropdownMenuPrimitive.SubContentProps = $props();
</script>

<DropdownMenuPrimitive.Portal>
	<DropdownMenuPrimitive.SubContent
		{...rest}
		data-slot="dropdown-menu-sub-content"
		class={cn(ANCHORED, "static", menu().surface(), "min-w-40", classProp)}
	/>
</DropdownMenuPrimitive.Portal>
