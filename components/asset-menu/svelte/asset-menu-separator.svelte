<script lang="ts">
import type { ComponentProps } from "svelte";
import ContextMenuSeparator from "../../context-menu/svelte/context-menu-separator.svelte";

let { ...rest }: ComponentProps<typeof ContextMenuSeparator> = $props();
</script>

<ContextMenuSeparator data-slot="asset-menu-separator" {...rest} />
