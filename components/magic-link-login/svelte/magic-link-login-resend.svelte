<script lang="ts">
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { formatCooldown } from "../magic-link-core";
import { magicLinkLoginState } from "./context";

let {
	onResend,
	onBack,
	class: classProp,
}: {
	onResend: () => void;
	/** Set `status` back to "idle" here. */
	onBack?: () => void;
	class?: string;
} = $props();

const ctx = magicLinkLoginState("MagicLinkLoginResend");
const shown = $derived(ctx.message !== undefined && ctx.view === "sent");
</script>

<!-- The spam hint, any resend error, and resend with its cooldown; `onBack` adds "Use a different email". -->
<div class={cn(ctx.styles.resend(), classProp)}>
	<p class={ctx.styles.hint()}>{ctx.labels.sentHint}</p>
	<div data-open={shown} class={ctx.styles.fold()}>
		<p class={ctx.styles.clip()} aria-hidden={!shown}>
			<span class={cn(ctx.styles.error(), "pt-2")}>{ctx.message}</span>
		</p>
	</div>
	<div class={ctx.styles.footer()}>
		{#if onBack}
			<Button variant="ghost" size="sm" onclick={onBack}>{ctx.labels.differentEmail}</Button>
		{/if}
		<Button
			variant="outline"
			size="sm"
			disabled={ctx.cooldown > 0}
			loading={ctx.status === "sending"}
			loadingLabel={ctx.labels.sending}
			onclick={onResend}
		>
			{ctx.cooldown > 0
				? `${ctx.labels.resendIn} ${formatCooldown(ctx.cooldown)}`
				: ctx.labels.resend}
		</Button>
	</div>
</div>
