<script lang="ts">
import { FloatingButtonGroup } from "@baby-ui/svelte";

let { onUndo, onShare }: { onUndo: () => void; onShare: () => void } = $props();
</script>

<FloatingButtonGroup
	label="Board actions"
	items={[
		{ id: "undo", label: "Undo", shortcut: "⌘Z", onSelect: onUndo },
		{ type: "separator" },
		{ id: "share", label: "Share", onSelect: onShare },
	]}
/>
