<script lang="ts">
import type { ComponentProps } from "svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";

let { ...rest }: ComponentProps<typeof ToggleGroupItem> = $props();
</script>

<ToggleGroupItem {...rest} />
