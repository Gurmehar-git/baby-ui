<script lang="ts">
import type { ComponentProps } from "svelte";
import DropdownMenuContent from "../../dropdown-menu/svelte/dropdown-menu-content.svelte";

let {
	align = "end",
	sideOffset = 6,
	...rest
}: ComponentProps<typeof DropdownMenuContent> = $props();
</script>

<DropdownMenuContent {align} {sideOffset} {...rest} />
