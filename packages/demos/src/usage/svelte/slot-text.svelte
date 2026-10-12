<script lang="ts">
import { SlotText } from "@baby-ui/svelte";

let { revenue }: { revenue: number } = $props();
</script>

<SlotText value={revenue} format={(value) => `$${value.toLocaleString("en-US")}`} />
