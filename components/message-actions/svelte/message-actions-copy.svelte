<script lang="ts">
import CopyButton from "../../copy-button/svelte/copy-button.svelte";
import { cn } from "../../lib/cn";
import { messageActionsState } from "./context";

let {
	text,
	label = "Copy",
	copiedLabel = "Copied",
	class: classProp,
}: { text: string; label?: string; copiedLabel?: string; class?: string } = $props();
const ctx = messageActionsState("MessageActionsCopy");
</script>

<!-- Copies the message; the icon turns into a check for a moment. -->
<CopyButton {text} iconOnly {label} {copiedLabel} class={cn(ctx.styles.button(), classProp)} />
