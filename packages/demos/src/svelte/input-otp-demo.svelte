<script lang="ts">
import {
	Button,
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof InputOTP>>(props));

// The code a real backend would have emailed; demo only.
const SAMPLE_CODE = "418206";

let value = $state("");
const size = $derived(p.size ?? "default");
const status = $derived(
	value.length < 6 ? "idle" : value === SAMPLE_CODE ? "verified" : "wrong",
);
</script>

<div class="flex flex-col items-center gap-3">
	<p class="text-muted-foreground text-sm">
		Enter the code we emailed you. Try <span class="font-mono">{SAMPLE_CODE}</span>.
	</p>
	<InputOTP
		maxlength={6}
		bind:value
		{size}
		aria-label="Verification code"
		invalid={status === "wrong"}
		invalidMotion={p.invalidMotion ?? "shake"}>
		{#snippet children({ cells })}
			<!-- Keyed by position: bits-ui hands out new cell objects on every keystroke. -->
			<InputOTPGroup>
				{#each cells.slice(0, 3) as cell, i (i)}
					<InputOTPSlot {cell} />
				{/each}
			</InputOTPGroup>
			<InputOTPSeparator />
			<InputOTPGroup>
				{#each cells.slice(3, 6) as cell, i (i)}
					<InputOTPSlot {cell} />
				{/each}
			</InputOTPGroup>
		{/snippet}
	</InputOTP>
	<p class="h-5 text-sm" aria-live="polite">
		{status === "verified"
			? "Verified. Signing you in."
			: status === "wrong"
				? "That code doesn't match. Check the email and try again."
				: ""}
	</p>
	<Button size="sm" variant="ghost" onclick={() => (value = "")}>Clear</Button>
</div>
