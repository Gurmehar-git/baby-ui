<script lang="ts">
import type { ComponentProps } from "svelte";
import ContextMenuLabel from "../../context-menu/svelte/context-menu-label.svelte";

let { ...rest }: ComponentProps<typeof ContextMenuLabel> = $props();
</script>

<ContextMenuLabel data-slot="asset-menu-label" {...rest} />
