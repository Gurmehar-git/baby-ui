<script lang="ts">
import type { ComponentProps } from "svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";

let props: ComponentProps<typeof ToggleGroupItem> = $props();
</script>

<ToggleGroupItem data-slot="email-draft-tone" {...props} />
