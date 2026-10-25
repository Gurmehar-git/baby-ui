<script lang="ts">
import Button from "../../button/svelte/button.svelte";
import { EMAIL_DRAFT_ICONS } from "../icons";
import { emailDraftState } from "./context";

let { label = "Edit text", class: classProp }: { label?: string; class?: string } =
	$props();
const ctx = emailDraftState("EmailDraftEdit");
</script>

<!-- Starts editing the text in place. Mousedown is held back so the field's blur doesn't close it first. -->
<Button
	data-slot="email-draft-edit"
	variant="ghost"
	size="icon-sm"
	aria-label={label}
	aria-pressed={ctx.editing}
	class={classProp}
	onmousedown={(event: MouseEvent) => event.preventDefault()}
	onclick={() => ctx.setEditing(true)}
>
	<svg viewBox="0 0 24 24" aria-hidden="true" class={ctx.styles.icon()}><path d={EMAIL_DRAFT_ICONS.pencil} /></svg>
</Button>
