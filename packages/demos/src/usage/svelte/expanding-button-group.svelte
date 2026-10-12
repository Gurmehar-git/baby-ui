<script lang="ts">
import { ExpandingButtonGroup } from "@baby-ui/svelte";
import type { Snippet } from "svelte";

let {
	reply,
	archive,
	onArchive,
}: { reply: Snippet; archive: Snippet; onArchive: () => Promise<void> } = $props();
</script>

<ExpandingButtonGroup
	label="Message actions"
	items={[
		{ id: "reply", label: "Reply", icon: reply },
		{ id: "archive", label: "Archive", doneLabel: "Archived", onSelect: onArchive, icon: archive },
	]}
/>
