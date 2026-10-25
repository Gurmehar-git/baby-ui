<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import Input from "../../input/svelte/input.svelte";
import { cn } from "../../lib/cn";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";
import { MESSAGE_ICONS } from "../icons";
import { messageActionsState } from "./context";

let {
	reasons,
	otherReason = "Other",
	title = "What went wrong?",
	heading,
	placeholder = "Tell us more",
	submitLabel = "Send",
	thanks = "Thanks for the feedback",
	onSubmit,
	class: classProp,
}: {
	reasons: string[];
	/** The reason that opens a text field. */
	otherReason?: string;
	title?: string;
	/** Replaces the title text. */
	heading?: Snippet;
	placeholder?: string;
	submitLabel?: string;
	thanks?: string;
	onSubmit?: (reason: string) => void;
	class?: string;
} = $props();
const ctx = messageActionsState("MessageActionsFeedbackPanel");

let reason = $state("");
let other = $state("");
let sent = $state(false);
let dismissed = $state(false);
const open = $derived(ctx.feedback === "down" && !dismissed);

// A new thumbs down starts the panel fresh.
$effect.pre(() => {
	if (ctx.feedback !== "down") return;
	dismissed = false;
	sent = false;
	reason = "";
	other = "";
});

// The thanks line shows for a moment, then the panel folds away.
$effect(() => {
	if (!sent) return;
	const timer = setTimeout(() => {
		dismissed = true;
	}, 1500);
	return () => clearTimeout(timer);
});

function send() {
	if (!reason || sent) return;
	onSubmit?.(reason === otherReason ? other.trim() || otherReason : reason);
	sent = true;
	ctx.announce(thanks);
}
</script>

<!-- Opens under the bar on a thumbs down: pick a reason (or write one), then send. -->
<div data-slot="message-actions-feedback-panel" data-open={open || undefined} inert={!open} class={cn(ctx.styles.panel(), classProp)}>
	<div class={ctx.styles.panelClip()}>
		<div class={ctx.styles.panelCard()}>
			<div class={ctx.styles.panelHead()}>
				{#if sent}
					<p class={ctx.styles.thanks()}>
						<svg viewBox="0 0 24 24" aria-hidden="true" class={ctx.styles.icon()}><path d={MESSAGE_ICONS.check} /></svg>
						{thanks}
					</p>
				{:else if heading}{@render heading()}{:else}{title}{/if}
				<button type="button" aria-label="Close" class={ctx.styles.button()} onclick={() => (dismissed = true)}>
					<svg viewBox="0 0 24 24" aria-hidden="true" class={ctx.styles.icon()}><path d={MESSAGE_ICONS.close} /></svg>
				</button>
			</div>
			<div data-folded={sent || undefined} inert={sent} class={ctx.styles.fold()}>
				<div class={ctx.styles.foldClip()}>
					<div class={ctx.styles.foldBody()}>
						<ToggleGroup
							type="single"
							variant="chip"
							size="sm"
							label={title}
							value={reason}
							onValueChange={(next) => (reason = typeof next === "string" ? next : "")}
						>
							{#each reasons as r (r)}
								<ToggleGroupItem value={r}>{r}</ToggleGroupItem>
							{/each}
						</ToggleGroup>
						<div data-folded={reason !== otherReason || undefined} inert={reason !== otherReason} class={ctx.styles.fold()}>
							<div class={ctx.styles.foldClip()}>
								<div class={ctx.styles.foldBody()}>
									<Input bind:value={other} {placeholder} aria-label={placeholder} />
								</div>
							</div>
						</div>
						<Button size="sm" class={ctx.styles.submit()} disabled={!reason} onclick={send}>{submitLabel}</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
