<script lang="ts">
import type { Snippet } from "svelte";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import { emailDraftState } from "./context";

let {
	value = $bindable(""),
	onValueChange,
	label = "Tone",
	class: classProp,
	children,
}: {
	/** Bindable. Set "" once the text is edited by hand. */
	value?: string;
	onValueChange?: (value: string) => void;
	label?: string;
	class?: string;
	children?: Snippet;
} = $props();
const ctx = emailDraftState("EmailDraftTones");
</script>

<!-- Rewrites of the text to pick from. -->
<ToggleGroup
	type="single"
	variant="outline"
	size="sm"
	{label}
	{value}
	class={classProp}
	onValueChange={(next) => {
		ctx.setEditing(false);
		value = typeof next === "string" ? next : "";
		onValueChange?.(value);
	}}
>
	{@render children?.()}
</ToggleGroup>
