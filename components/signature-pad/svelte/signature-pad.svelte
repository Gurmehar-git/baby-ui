<script lang="ts">
import { onDestroy } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";
import {
	downloadBlob,
	HISTORY_LIMIT,
	historyKey,
	INK_SIZES,
	INK_TONES,
	INK_WIDTHS,
	type InkStroke,
	type InkTone,
	type InkWidth,
	inkPoint,
	PAD_HEIGHT,
	PAD_ICONS,
	PAD_WIDTH,
	type PadIcon,
	type ReplayPlan,
	replayFrame,
	replayPlan,
	signatureSvgBlob,
	signatureToPng,
	strokePath,
	TONE_LABELS,
	toneColors,
	WIDTH_LABELS,
} from "../ink";
import { type SignaturePadVariant, signaturePad } from "../variants";

let {
	value = $bindable(),
	onValueChange,
	variant = "default",
	label = "Signature",
	hint = "Sign here",
	signer,
	defaultTone = "default",
	defaultWidth = "medium",
	downloadable = false,
	fileName = "signature",
	disabled = false,
	class: className,
}: {
	/** The strokes; empty means unsigned. Bindable. */
	value?: InkStroke[];
	onValueChange?: (strokes: InkStroke[]) => void;
	/** `default` frames the pad on a bordered surface; `line` keeps only the baseline. */
	variant?: SignaturePadVariant;
	/** Accessible name of the pad. */
	label?: string;
	/** Rests above the baseline until the first stroke. */
	hint?: string;
	/** Printed under the line, e.g. the signer's name. */
	signer?: string;
	defaultTone?: InkTone;
	defaultWidth?: InkWidth;
	/** Shows "Save as" PNG and SVG buttons; both crop to the ink. */
	downloadable?: boolean;
	/** Export file name, without extension. */
	fileName?: string;
	disabled?: boolean;
	class?: string;
} = $props();

const EXPORTS = ["png", "svg"] as const;
const uid = $props.id();
const s = $derived(signaturePad({ variant }));
let pad = $state<HTMLDivElement | null>(null);
let own = $state<InkStroke[]>([]);
const strokes = $derived(value ?? own);
let past = $state<InkStroke[][]>([]);
let future = $state<InkStroke[][]>([]);
let fresh = $state<string | null>(null);
let live = $state<InkStroke | null>(null);
// svelte-ignore state_referenced_locally
let tone = $state<InkTone>(defaultTone);
// svelte-ignore state_referenced_locally
let width = $state<InkWidth>(defaultWidth);
let wiping = $state(false);
let replayAt = $state<number | null>(null);
let saved = $state<"png" | "svg" | "failed" | null>(null);
let status = $state("");
let pointerId: number | null = null;
let startedAt = 0;
let plan: ReplayPlan | null = null;
let frame = 0;
let savedTimer: ReturnType<typeof setTimeout> | undefined;
const empty = $derived(strokes.length === 0);
const replaying = $derived(replayAt !== null);
const frameNow = $derived(
	replayAt !== null && plan ? replayFrame(strokes, plan, replayAt) : null,
);

onDestroy(() => {
	cancelAnimationFrame(frame);
	clearTimeout(savedTimer);
});

function emit(next: InkStroke[]) {
	if (value === undefined) own = next;
	else value = next;
	onValueChange?.(next);
}
function commit(next: InkStroke[], freshId: string | null = null) {
	past = [...past, strokes].slice(-HISTORY_LIMIT);
	future = [];
	fresh = freshId;
	emit(next);
}
function stopReplay() {
	cancelAnimationFrame(frame);
	replayAt = null;
}
function undo() {
	const back = past.at(-1);
	if (!back || live || wiping) return;
	stopReplay();
	future = [strokes, ...future];
	past = past.slice(0, -1);
	fresh = null;
	emit(back);
	status = "Undone";
}
function redo() {
	const next = future[0];
	if (!next || live || wiping) return;
	stopReplay();
	past = [...past, strokes];
	future = future.slice(1);
	fresh = null;
	emit(next);
	status = "Redone";
}
function finishWipe() {
	commit([]);
	wiping = false;
	status = "Signature cleared. Undo brings it back.";
}
function clear() {
	if (empty || wiping || live) return;
	stopReplay();
	// Reduced motion has no wipe transition to end, so it clears at once.
	if (matchMedia("(prefers-reduced-motion: reduce)").matches) return finishWipe();
	wiping = true;
}
function toggleReplay() {
	if (replaying) {
		stopReplay();
		status = "Replay stopped";
		return;
	}
	if (empty || live) return;
	const current = replayPlan(strokes);
	plan = current;
	const begin = performance.now();
	const tick = (now: number) => {
		const at = (now - begin) * current.speed;
		if (at >= current.total) {
			replayAt = null;
			status = "Replay finished";
			return;
		}
		replayAt = at;
		frame = requestAnimationFrame(tick);
	};
	replayAt = 0;
	status = "Replaying signature";
	frame = requestAnimationFrame(tick);
}
async function save(kind: "png" | "svg") {
	if (empty || !pad) return;
	clearTimeout(savedTimer);
	const colors = toneColors(pad);
	try {
		const blob =
			kind === "svg"
				? signatureSvgBlob(strokes, colors)
				: await signatureToPng(strokes, colors);
		downloadBlob(blob, `${fileName}.${kind}`);
		saved = kind;
		status = `Saved ${fileName}.${kind}`;
	} catch {
		saved = "failed";
		status = "Export failed. Try again.";
	}
	savedTimer = setTimeout(() => (saved = null), 1800);
}
function add(event: PointerEvent, stroke: InkStroke): InkStroke {
	if (!pad) return stroke;
	const el = pad;
	const samples = event.getCoalescedEvents?.() ?? [event];
	return {
		...stroke,
		points: [
			...stroke.points,
			...samples.map((sample) => inkPoint(sample, el, startedAt)),
		],
	};
}
</script>

{#snippet icon(name: PadIcon, extra?: string)}
	<svg viewBox="0 0 24 24" aria-hidden="true" class={cn(s.icon(), extra)}>
		<path d={PAD_ICONS[name]} />
	</svg>
{/snippet}

<div data-slot="signature-pad" data-variant={variant} class={cn(s.root(), className)}>
	<!-- The pad is a drawing surface (role=application): it takes focus, pointer ink and its shortcuts. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
	<div
		bind:this={pad}
		role="application"
		aria-roledescription="signature pad"
		aria-label="{label}, {empty ? 'empty' : `${strokes.length} ${strokes.length === 1 ? 'stroke' : 'strokes'}`}"
		aria-describedby="{uid}-keys"
		tabindex={disabled ? -1 : 0}
		data-drawing={Boolean(live)}
		class={s.surface()}
		onpointerdown={(event) => {
			if (disabled || wiping || pointerId !== null || event.button !== 0) return;
			event.preventDefault();
			stopReplay();
			event.currentTarget.focus({ preventScroll: true });
			event.currentTarget.setPointerCapture(event.pointerId);
			pointerId = event.pointerId;
			startedAt = event.timeStamp;
			live = add(event, {
				id: `${uid}-${event.timeStamp}`,
				points: [],
				tone,
				width,
				at: event.timeStamp,
			});
		}}
		onpointermove={(event) => {
			if (live && event.pointerId === pointerId) live = add(event, live);
		}}
		onpointerup={(event) => {
			if (!live || event.pointerId !== pointerId) return;
			pointerId = null;
			commit([...strokes, live], live.id);
			live = null;
			status = `Stroke added. ${strokes.length} in the signature.`;
		}}
		onpointercancel={() => {
			pointerId = null;
			live = null;
		}}
		onkeydown={(event) => {
			if (event.key === "Escape" && replaying) return stopReplay();
			const action = historyKey(event);
			if (!action || disabled || event.target !== event.currentTarget) return;
			event.preventDefault();
			if (action === "undo") undo();
			else if (action === "redo") redo();
			else clear();
		}}
	>
		{@render icon("mark", s.mark())}
		<span aria-hidden="true" class={s.baseline()}></span>
		<span aria-hidden="true" data-hidden={!empty || Boolean(live) || wiping} class={s.hint()}>{hint}</span>
		{#if signer}<span aria-hidden="true" class={s.signer()}>{signer}</span>{/if}
		<svg
			aria-hidden="true"
			viewBox="0 0 {PAD_WIDTH} {PAD_HEIGHT}"
			data-wiping={wiping}
			class={s.ink()}
			ontransitionend={(event) => {
				if (wiping && event.target === event.currentTarget) finishWipe();
			}}
		>
			{#each strokes as stroke, i (stroke.id)}
				<path
					d={frameNow?.paths[i] ?? strokePath(stroke)}
					data-tone={stroke.tone}
					data-fresh={stroke.id === fresh}
					class={s.stroke()}
				/>
			{/each}
			{#if live}
				<path d={strokePath(live, { live: true })} data-tone={live.tone} data-fresh="true" class={s.stroke()} />
			{/if}
			{#if frameNow?.nib}
				<circle
					cx={frameNow.nib.x}
					cy={frameNow.nib.y}
					r={frameNow.nib.r}
					data-tone={frameNow.nib.tone}
					class={s.nib()}
				/>
			{/if}
		</svg>
		<span aria-hidden="true" data-wiping={wiping} class={s.sweep()}></span>
	</div>
	<div class={s.toolbar()}>
		<div class={s.group()}>
			<ToggleGroup
				variant="segmented"
				size="sm"
				label="Ink colour"
				value={tone}
				onValueChange={(next) => {
					const picked = INK_TONES.find((item) => item === next);
					if (!picked) return;
					tone = picked;
					status = `${TONE_LABELS[picked]} selected`;
				}}
			>
				{#each INK_TONES as item (item)}
					<ToggleGroupItem value={item} aria-label={TONE_LABELS[item]} title={TONE_LABELS[item]}>
						<span aria-hidden="true" data-tone={item} class={s.swatch()}></span>
					</ToggleGroupItem>
				{/each}
			</ToggleGroup>
			<span aria-hidden="true" class={s.divider()}></span>
			<ToggleGroup
				variant="segmented"
				size="sm"
				label="Nib width"
				value={width}
				onValueChange={(next) => {
					const picked = INK_WIDTHS.find((item) => item === next);
					if (!picked) return;
					width = picked;
					status = `${WIDTH_LABELS[picked]} selected`;
				}}
			>
				{#each INK_WIDTHS as item (item)}
					<ToggleGroupItem value={item} aria-label={WIDTH_LABELS[item]} title={WIDTH_LABELS[item]}>
						<span
							aria-hidden="true"
							class={s.weight()}
							style:width="{INK_SIZES[item] + 2}px"
							style:height="{INK_SIZES[item] + 2}px"
						></span>
					</ToggleGroupItem>
				{/each}
			</ToggleGroup>
		</div>
		<div class={s.group()}>
			<Button size="icon-sm" variant="ghost" aria-label="Undo" title="Undo" onclick={undo} disabled={disabled || !past.length || wiping}>
				{@render icon("undo")}
			</Button>
			<Button size="icon-sm" variant="ghost" aria-label="Redo" title="Redo" onclick={redo} disabled={disabled || !future.length || wiping}>
				{@render icon("redo")}
			</Button>
			<Button
				size="icon-sm"
				variant="ghost"
				aria-label={replaying ? "Stop replay" : "Replay signature"}
				title={replaying ? "Stop replay" : "Replay signature"}
				aria-pressed={replaying}
				onclick={toggleReplay}
				disabled={empty || wiping}
			>
				{#key replaying}{@render icon(replaying ? "stop" : "play", s.swap())}{/key}
			</Button>
			<Button
				size="icon-sm"
				variant="ghost"
				aria-label="Clear signature"
				title="Clear signature"
				onclick={clear}
				disabled={disabled || empty || wiping}
			>
				{@render icon("clear")}
			</Button>
		</div>
	</div>
	{#if downloadable}
		<div class={s.exports()}>
			<span class={s.exportLabel()}>Save as</span>
			{#each EXPORTS as kind (kind)}
				<Button
					size="sm"
					variant="outline"
					class="grid min-w-20"
					aria-label="Download {kind.toUpperCase()}"
					disabled={empty}
					onclick={() => save(kind)}
				>
					{#key saved === kind}
						<span class={s.swap()}>
							{#if saved === kind}{@render icon("check")} Saved{:else}{@render icon("download")} {kind.toUpperCase()}{/if}
						</span>
					{/key}
				</Button>
			{/each}
		</div>
	{/if}
	<p id="{uid}-keys" class="sr-only">
		Draw with a pointer, pen or finger. Mod plus Z undoes, Shift plus Mod plus Z redoes, Delete
		clears, Escape stops a replay.
	</p>
	<p role="status" aria-live="polite" class="sr-only">{status}</p>
</div>
