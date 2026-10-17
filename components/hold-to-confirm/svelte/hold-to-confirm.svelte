<script lang="ts">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { morph, trackActiveWidth } from "../../lib/morph";
import { createHold } from "../hold";
import {
	type HoldToConfirmSize,
	type HoldToConfirmVariant,
	holdToConfirm,
} from "../variants";

let {
	label,
	confirmedLabel = "Done",
	onConfirm,
	duration = 1200,
	icon,
	variant = "default",
	size = "default",
	confirmed = $bindable(),
	onHoldChange,
	disabled = false,
	class: classProp,
	...rest
}: {
	/** The instruction and the action, e.g. "Hold to delete project". */
	label: string;
	/** Shown once the hold completes, e.g. "Deleted". */
	confirmedLabel?: string;
	/** Called once when the hold completes. */
	onConfirm: () => void;
	/** Hold length in milliseconds. */
	duration?: number;
	icon?: Snippet;
	variant?: HoldToConfirmVariant;
	size?: HoldToConfirmSize;
	/** The done state; bindable. Set it back to false to reset. */
	confirmed?: boolean;
	/** Reports when a hold starts and ends, for hints such as "Keep holding". */
	onHoldChange?: (holding: boolean) => void;
	disabled?: boolean;
	class?: string;
} & Omit<HTMLButtonAttributes, "children" | "onclick"> = $props();

const hintId = $props.id();
let ownDone = $state(false);
let holding = $state(false);
const done = $derived(confirmed ?? ownDone);
// Server and first paint only; after that the engine owns the fill's clip.
const initialDone = untrack(() => done);
let button = $state<HTMLButtonElement>();
let engine: ReturnType<typeof createHold> | null = null;

const options = $derived({
	duration,
	done,
	disabled,
	onComplete: () => {
		if (confirmed === undefined) ownDone = true;
		else confirmed = true;
		onConfirm();
	},
	onHoldChange: (value: boolean) => {
		holding = value;
		onHoldChange?.(value);
	},
});

$effect(() => {
	const el = button;
	if (!el) return;
	const created = untrack(() => createHold(el, options));
	engine = created;
	return () => {
		created.destroy();
		engine = null;
	};
});
$effect(() => {
	engine?.update(options);
});

const s = $derived(holdToConfirm({ variant, size }));
const m = morph();
const seconds = $derived(
	(duration / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 }),
);

function widthOf(frame: HTMLElement) {
	return trackActiveWidth(frame);
}
</script>

{#snippet face()}
	<span class={s.face()}>
		<span class={s.icon()}>
			<span data-on={!done} class={m.icon()}>
				{#if icon}
					{@render icon()}
				{:else}
					<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="M2.5 4h11M6.5 4V2.8h3V4M4 4l.6 9a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9L12 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				{/if}
			</span>
			<span data-on={done} class={m.icon()}>
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M4 12.5l5 5L20 6.5" pathLength="1" class={s.check()} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</span>
		</span>
		<span {@attach widthOf} class={m.frame()}>
			<span data-on={!done} class={m.face()}>{label}</span>
			<span data-on={done} class={m.face()}>{confirmedLabel}</span>
		</span>
	</span>
{/snippet}

<button
	{...rest}
	bind:this={button}
	type="button"
	data-slot="hold-to-confirm"
	data-state={done ? "done" : holding ? "holding" : "idle"}
	{disabled}
	aria-disabled={done || undefined}
	aria-label={done ? confirmedLabel : label}
	aria-describedby={done ? undefined : hintId}
	class={cn(s.root(), classProp)}
>
	{@render face()}
	<span data-hold-fill="" class={s.fill()} style:clip-path={initialDone ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)"} aria-hidden="true">
		{@render face()}
	</span>
</button>
<span id={hintId} class="sr-only">
	Press and hold for {seconds} seconds to confirm. With a keyboard, hold Space or Enter.
</span>
<span class="sr-only" role="status">{done ? confirmedLabel : ""}</span>
