<script lang="ts">
import type { ComponentProps } from "svelte";
import DropdownMenu from "../../dropdown-menu/svelte/dropdown-menu.svelte";

let { open = $bindable(false), ...rest }: ComponentProps<typeof DropdownMenu> = $props();
</script>

<DropdownMenu bind:open {...rest} />
