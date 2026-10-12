<script lang="ts">
import { ConfirmMorph } from "@baby-ui/svelte";

let { remove, restore }: { remove: () => Promise<void>; restore: () => Promise<void> } =
	$props();
</script>

<ConfirmMorph label="Delete project" onConfirm={remove} onUndo={restore} />
