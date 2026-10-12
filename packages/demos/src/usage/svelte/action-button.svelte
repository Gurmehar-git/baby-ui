<script lang="ts">
import { ActionButton } from "@baby-ui/svelte";

let { url }: { url: string } = $props();
</script>

<ActionButton variant="outline" label="Copy link" successLabel="Copied" onAction={() => navigator.clipboard.writeText(url)} />
