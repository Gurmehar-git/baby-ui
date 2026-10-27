<script lang="ts">
import type { ComponentProps } from "svelte";
import ContextMenuTrigger from "../../context-menu/svelte/context-menu-trigger.svelte";

let { ...rest }: ComponentProps<typeof ContextMenuTrigger> = $props();
</script>

<ContextMenuTrigger {...rest} />
