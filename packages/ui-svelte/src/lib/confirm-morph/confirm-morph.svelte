<script lang="ts">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import { button } from "../button/variants";
import { cn } from "../lib/cn";
import { trackActiveWidth } from "../lib/morph";
import RollingDigits from "../rolling-digits/rolling-digits.svelte";
import Spinner from "../spinner/spinner.svelte";
import {
	type ConfirmMorphFace,
	type ConfirmMorphMode,
	type ConfirmMorphState,
	createConfirmMorph,
} from "./confirm";
import {
	type ConfirmMorphSize,
	type ConfirmMorphVariant,
	confirmMorph,
} from "./variants";

let {
	label,
	icon,
	prompt,
	confirmLabel = "Delete",
	cancelLabel = "Cancel",
	pendingLabel = "Deleting",
	doneLabel = "Deleted",
	errorLabel = "Couldn't finish",
	retryLabel = "Retry",
	undoLabel = "Undo",
	undoingLabel = "Restoring",
	countdownLabel,
	variant = "destructive",
	size = "default",
	mode = "press",
	holdDuration = 1000,
	countdown = 3,
	onConfirm,
	onUndo,
	onCancel,
	state: stateProp = $bindable(),
	defaultState = "idle",
	onStateChange,
	confirmTimeout = 6000,
	resultTimeout = 5000,
	cancelOnOutsidePress = true,
	disabled = false,
	class: classProp,
}: {
	/** The resting label, e.g. "Delete project". */
	label: string;
	icon?: Snippet;
	/** The question while confirming; defaults to the label with a question mark. */
	prompt?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	/** Beside the spinner while `onConfirm` resolves. */
	pendingLabel?: string;
	doneLabel?: string;
	errorLabel?: string;
	retryLabel?: string;
	undoLabel?: string;
	/** Beside the spinner while `onUndo` resolves. */
	undoingLabel?: string;
	/** Text before the seconds in `countdown` mode; defaults to the pending label plus "in". */
	countdownLabel?: string;
	/** Colour of the confirm answer: destructive for actions that destroy, default for reversible ones. */
	variant?: ConfirmMorphVariant;
	size?: ConfirmMorphSize;
	mode?: ConfirmMorphMode;
	/** Milliseconds the confirm must be held in `hold` mode. */
	holdDuration?: number;
	/** Seconds counted down in `countdown` mode. */
	countdown?: number;
	/** Runs on confirm. A promise shows the pending face; a rejection shows the error face. */
	onConfirm?: () => unknown;
	/** Offering it adds Undo to the result. */
	onUndo?: () => unknown;
	onCancel?: () => void;
	/** Bindable. Leave unset to let the control own it. */
	state?: ConfirmMorphState;
	defaultState?: ConfirmMorphState;
	onStateChange?: (state: ConfirmMorphState) => void;
	/** Milliseconds before an unanswered question returns to rest; 0 turns it off. */
	confirmTimeout?: number;
	/** Milliseconds a result stays before returning to rest; 0 turns it off. */
	resultTimeout?: number;
	cancelOnOutsidePress?: boolean;
	disabled?: boolean;
	class?: string;
} = $props();

const promptId = $props.id();
let inner = $state(untrack(() => defaultState));
const current = $derived(stateProp ?? inner);
let working = $state<"confirm" | "undo">("confirm");
let seconds = $state<number | null>(null);
const face: ConfirmMorphFace = $derived(
	current === "confirming" && seconds !== null ? "counting" : current,
);

let root = $state<HTMLDivElement>();
let surface = $state<HTMLDivElement>();
let engine: ReturnType<typeof createConfirmMorph> | null = null;

const options = $derived({
	state: current,
	mode,
	holdDuration,
	countdown,
	confirmTimeout,
	resultTimeout,
	cancelOnOutsidePress,
	onConfirm,
	onUndo,
	onCancel,
	go: (next: ConfirmMorphState) => {
		if (stateProp === undefined) inner = next;
		else stateProp = next;
		onStateChange?.(next);
	},
	onWorkingChange: (kind: "confirm" | "undo") => {
		working = kind;
	},
	onCount: (value: number | null) => {
		seconds = value;
	},
});

$effect(() => {
	const r = root;
	const f = surface;
	if (!r || !f) return;
	const created = untrack(() => createConfirmMorph(r, options));
	engine = created;
	const stop = trackActiveWidth(f);
	return () => {
		created.destroy();
		stop();
		engine = null;
	};
});
$effect(() => {
	engine?.update(options);
});

const s = $derived(confirmMorph({ variant, size }));
const secondary = $derived(
	cn(button({ variant: "ghost", size: "sm" }), s.action(), s.secondary()),
);
const confirmClass = $derived(
	cn(
		button({
			variant: variant === "destructive" ? "destructive_soft" : "default",
			size: "sm",
		}),
		s.action(),
	),
);
const shownPrompt = $derived(prompt ?? `${label}?`);
const shownCountdown = $derived(countdownLabel ?? `${pendingLabel} in`);
const announcement = $derived(
	face === "confirming"
		? shownPrompt
		: face === "counting"
			? `${shownCountdown} ${countdown} seconds`
			: face === "done"
				? onUndo
					? `${doneLabel}. ${undoLabel} is available.`
					: doneLabel
				: face === "error"
					? errorLabel
					: "",
);
</script>

<div
	bind:this={root}
	data-slot="confirm-morph"
	data-state={current}
	data-face={face}
	data-mode={mode}
	tabindex="-1"
	aria-busy={current === "pending" || undefined}
	class={cn(s.root(), classProp)}
>
	<div bind:this={surface} class={s.surface()}>
		<div data-face="idle" data-on={face === "idle"} inert={face !== "idle"} class={s.face()}>
			<span class={s.part()} style:--i={0}>
				<button type="button" data-autofocus {disabled} class={s.trigger()} onclick={() => engine?.ask()}>
					{#if icon}<span aria-hidden="true">{@render icon()}</span>{/if}
					{label}
				</button>
			</span>
		</div>
		<div
			data-face="confirming"
			data-on={face === "confirming"}
			inert={face !== "confirming"}
			role="group"
			aria-labelledby={promptId}
			class={s.face()}
		>
			<span id={promptId} class={cn(s.part(), s.prompt())} style:--i={0}>{shownPrompt}</span>
			<span class={s.part()} style:--i={1}>
				<button type="button" class={secondary} onclick={() => engine?.cancel()}>{cancelLabel}</button>
			</span>
			<span class={s.part()} style:--i={2}>
				{#if mode === "hold"}
					<button
						type="button"
						data-autofocus
						data-confirm-hold
						aria-label="{confirmLabel}, press and hold"
						class={cn(confirmClass, s.hold())}
					>
						{confirmLabel}
						<span data-hold-fill="" class={s.fill()} aria-hidden="true">{confirmLabel}</span>
					</button>
				{:else}
					<button type="button" data-autofocus class={confirmClass} onclick={() => engine?.answer()}>
						{confirmLabel}
					</button>
				{/if}
			</span>
		</div>
		{#if mode === "countdown"}
			<div data-face="counting" data-on={face === "counting"} inert={face !== "counting"} class={s.face()}>
				<span class={cn(s.part(), s.status(), s.muted())} style:--i={0}>
					<svg viewBox="0 0 16 16" fill="none" class={s.ring()} aria-hidden="true">
						<circle cx="8" cy="8" r="6.25" stroke-width="1.75" class={s.ringTrack()} />
						<circle
							data-confirm-ring=""
							cx="8"
							cy="8"
							r="6.25"
							stroke-width="1.75"
							stroke-linecap="round"
							pathLength="1"
							class={s.ringFill()}
						/>
					</svg>
					<span>
						{shownCountdown}
						<RollingDigits value={seconds ?? countdown} direction="down" class="text-foreground" />
					</span>
				</span>
				<span class={s.part()} style:--i={1}>
					<button type="button" class={secondary} onclick={() => engine?.cancel()}>{cancelLabel}</button>
				</span>
			</div>
		{/if}
		<div data-face="pending" data-on={face === "pending"} inert={face !== "pending"} class={s.face()}>
			<span class={cn(s.part(), s.status(), s.muted(), "pr-4")} style:--i={0}>
				<Spinner size="sm" label={working === "undo" ? undoingLabel : pendingLabel} />
				{working === "undo" ? undoingLabel : pendingLabel}
			</span>
		</div>
		<div data-face="done" data-on={face === "done"} inert={face !== "done"} class={s.face()}>
			<span class={cn(s.part(), s.status(), !onUndo && "pr-3.5")} style:--i={0}>
				<svg viewBox="0 0 18 18" class={s.check()} aria-hidden="true">
					<circle cx="9" cy="9" r="8" stroke="none" />
					<path
						d="M5.6 9.3 7.8 11.4 12.4 6.7"
						fill="none"
						stroke-width="1.9"
						stroke-linecap="round"
						stroke-linejoin="round"
						pathLength="1"
						class={s.tick()}
					/>
				</svg>
				{doneLabel}
			</span>
			{#if onUndo}
				<span class={s.part()} style:--i={1}>
					<button type="button" data-autofocus class={secondary} onclick={() => engine?.undo()}>{undoLabel}</button>
				</span>
			{/if}
		</div>
		<div data-face="error" data-on={face === "error"} inert={face !== "error"} class={s.face()}>
			<span class={cn(s.part(), s.status())} style:--i={0}>
				<svg viewBox="0 0 16 16" fill="none" class={s.alert()} aria-hidden="true">
					<circle cx="8" cy="8" r="6.25" stroke="currentColor" stroke-width="1.5" />
					<path d="M8 4.8v3.6M8 10.9v.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
				</svg>
				{errorLabel}
			</span>
			<span class={s.part()} style:--i={1}>
				<button type="button" data-autofocus class={secondary} onclick={() => engine?.retry()}>{retryLabel}</button>
			</span>
		</div>
	</div>
	<span class="sr-only" role="status">{announcement}</span>
</div>
