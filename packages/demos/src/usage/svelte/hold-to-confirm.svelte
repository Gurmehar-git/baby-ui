<script lang="ts">
import { HoldToConfirm } from "@baby-ui/svelte";

let { onDelete }: { onDelete: () => void } = $props();
</script>

<HoldToConfirm label="Hold to delete project" confirmedLabel="Deleted" variant="destructive" onConfirm={onDelete} />
