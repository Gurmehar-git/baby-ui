<script lang="ts">
import { InlineEdit } from "@baby-ui/svelte";

let { name, rename }: { name: string; rename: (next: string) => Promise<void> } =
	$props();
</script>

<InlineEdit label="Project name" value={name} onSave={rename} as="h2" />
