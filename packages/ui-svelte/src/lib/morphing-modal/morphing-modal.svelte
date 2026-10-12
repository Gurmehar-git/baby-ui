<script lang="ts">
import type { Snippet } from "svelte";
import { prefersReducedMotion } from "svelte/motion";
import { cn } from "../lib/cn";
import { invert, MORPH_EASE, MORPH_MS, type MorphSpring } from "./morph";
import { type MorphingModalSize, morphingModal } from "./variants";

type Props = {
	trigger: Snippet;
	children: Snippet;
	title: string;
	class?: string;
	spring?: MorphSpring;
	size?: MorphingModalSize;
	dismissOnBackdrop?: boolean;
	backdropBlur?: number;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

let {
	trigger,
	children,
	title,
	class: classProp,
	spring = "gentle",
	size = "default",
	dismissOnBackdrop = true,
	backdropBlur = 8,
	open = $bindable(false),
	onOpenChange,
}: Props = $props();

let triggerEl = $state<HTMLButtonElement>();
let dialog = $state<HTMLDialogElement>();
let panel = $state<HTMLDivElement>();
let hidden = $state(false);
let wasOpen = false;

const titleId = $props.id();
const styles = $derived(morphingModal({ size }));

function animateMorph(reverse: boolean): Promise<void> {
	const from = triggerEl?.getBoundingClientRect();
	const to = panel?.getBoundingClientRect();
	if (!from || !to || !panel || prefersReducedMotion.current) return Promise.resolve();

	const collapsed = invert(from, to);
	const frames = reverse
		? [
				{ transform: "none", opacity: 1 },
				{ transform: collapsed, opacity: 0 },
			]
		: [
				{ transform: collapsed, opacity: 0 },
				{ transform: "none", opacity: 1 },
			];

	// Closing is faster: the user has already decided.
	const duration = MORPH_MS[spring] * (reverse ? 0.7 : 1);
	return panel
		.animate(frames, {
			duration,
			easing: MORPH_EASE[spring],
			fill: "both",
		})
		.finished.then(() => undefined);
}

async function runOpen() {
	dialog?.showModal();
	hidden = true;
	await animateMorph(false);
}

async function runClose() {
	await animateMorph(true);
	hidden = false;
	dialog?.close();
	triggerEl?.focus();
}

// Drives the native dialog + FLIP animation from resolved open state, so a
// bound `open` prop and the internal trigger/close click both funnel here.
$effect(() => {
	if (open === wasOpen) return;
	wasOpen = open;
	if (open) void runOpen();
	else void runClose();
});

function setOpen(next: boolean) {
	open = next;
	onOpenChange?.(next);
}
</script>

<button
	bind:this={triggerEl}
	type="button"
	onclick={() => setOpen(true)}
	style:opacity={hidden ? 0 : 1}
	class={styles.trigger()}
>
	{@render trigger()}
</button>

<dialog
	bind:this={dialog}
	aria-labelledby={titleId}
	oncancel={(e) => {
		e.preventDefault();
		setOpen(false);
	}}
	onclick={(e) => {
		if (dismissOnBackdrop && e.target === dialog) setOpen(false);
	}}
	style:--morph-blur="{backdropBlur}px"
	class={styles.dialog()}
>
	<div
		bind:this={panel}
		data-slot="morphing-modal"
		class={cn(styles.panel(), classProp)}
	>
		<div class={styles.header()}>
			<h2 id={titleId} class={styles.title()}>{title}</h2>
			<button
				type="button"
				onclick={() => setOpen(false)}
				aria-label="Close"
				class={styles.close()}
			>
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4">
					<path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				</svg>
			</button>
		</div>
		<div class={styles.body()}>{@render children()}</div>
	</div>
</dialog>
