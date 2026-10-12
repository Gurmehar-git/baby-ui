<script lang="ts">
import { ShortcutRecorder } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ShortcutRecorder>>(props));
const BINDINGS = [
	{ id: "palette", label: "Command palette", shortcut: "mod+k" },
	{ id: "new", label: "New document", shortcut: "mod+shift+n" },
];
let value = $state<string | null>("mod+shift+f");
</script>

<div class="w-full max-w-sm">
	<ShortcutRecorder
		label={p.label || "Search files"}
		bind:value
		defaultValue="mod+shift+f"
		bindings={BINDINGS}
		warnReserved={p.warnReserved}
		requireModifier={p.requireModifier}
		size={p.size}
	/>
</div>
