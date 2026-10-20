<script lang="ts">
import Button from "../../button/svelte/button.svelte";
import Input from "../../input/svelte/input.svelte";
import Label from "../../label/svelte/label.svelte";
import { cn } from "../../lib/cn";
import { isValidEmail } from "../magic-link-core";
import { magicLinkLoginState } from "./context";

let {
	onSubmit,
	class: classProp,
}: { onSubmit: (email: string) => void; class?: string } = $props();

const ctx = magicLinkLoginState("MagicLinkLoginEmail");
const sending = $derived(ctx.status === "sending");
const shown = $derived(ctx.message !== undefined && ctx.view === "form");

function submit(event: SubmitEvent) {
	event.preventDefault();
	if (sending) return;
	if (!isValidEmail(ctx.address)) {
		ctx.setInvalid(true);
		document.getElementById(ctx.inputId)?.focus();
		return;
	}
	onSubmit(ctx.address);
}
</script>

<!-- The email field and submit; a bad address or server error folds open under the field. -->
<form class={cn(ctx.styles.form(), classProp)} novalidate onsubmit={submit}>
	<div class={ctx.styles.field()}>
		<Label for={ctx.inputId}>{ctx.labels.email}</Label>
		<Input
			id={ctx.inputId}
			name="email"
			type="email"
			inputmode="email"
			autocomplete="email"
			autocapitalize="none"
			spellcheck={false}
			placeholder={ctx.labels.placeholder}
			bind:value={() => ctx.email, ctx.setEmail}
			invalid={shown}
			aria-describedby={shown ? ctx.errorId : undefined}
			readonly={sending}
		/>
		<div data-open={shown} class={ctx.styles.fold()}>
			<p id={ctx.errorId} class={ctx.styles.clip()} aria-hidden={!shown}>
				<span class={ctx.styles.error()}>{ctx.message}</span>
			</p>
		</div>
	</div>
	<Button
		type="submit"
		class={ctx.styles.submit()}
		loading={sending}
		loadingLabel={ctx.labels.sending}
	>
		{ctx.labels.submit}
	</Button>
</form>
