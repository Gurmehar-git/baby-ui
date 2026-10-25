<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import Textarea from "../../textarea/svelte/textarea.svelte";
import { emailDraftState } from "./context";

let {
	value = $bindable(""),
	onValueChange,
	label = "Email text",
	class: classProp,
	children,
}: {
	/** Bindable. */
	value?: string;
	onValueChange?: (value: string) => void;
	label?: string;
	class?: string;
	/** Shown after the text while it is not being edited, such as a link. */
	children?: Snippet;
} = $props();
const ctx = emailDraftState("EmailDraftMessage");
let field = $state<HTMLTextAreaElement | null>(null);

$effect(() => {
	if (!ctx.editing || !field) return;
	field.focus();
	field.setSelectionRange(field.value.length, field.value.length);
});

function keydown(event: KeyboardEvent) {
	if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
		event.preventDefault();
		ctx.send();
	}
	if (event.key === "Escape") ctx.setEditing(false);
}
</script>

<!-- The email text. Click it, or press EmailDraftEdit, to edit in place; ⌘/Ctrl Enter sends. -->
<div data-slot="email-draft-message" class={cn(ctx.styles.message(), classProp)}>
	{#if ctx.editing}
		<Textarea
			bind:ref={field}
			bind:value={() => value, (next) => {
				value = next;
				onValueChange?.(next);
			}}
			autoGrow
			rows={1}
			size="sm"
			variant="soft"
			aria-label={label}
			class={ctx.styles.editor()}
			onblur={() => ctx.setEditing(false)}
			onkeydown={keydown}
		/>
	{:else}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
		<p class={ctx.styles.text()} onclick={() => ctx.setEditing(true)}>{value} {@render children?.()}</p>
	{/if}
</div>
