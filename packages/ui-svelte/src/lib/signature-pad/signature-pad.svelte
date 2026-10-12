<script lang="ts">
import Button from "../button/button.svelte";
import { cn } from "../lib/cn";
import ToggleGroup from "../toggle-group/toggle-group.svelte";
import ToggleGroupItem from "../toggle-group/toggle-group-item.svelte";
import {
	downloadBlob,
	historyKey,
	type InkStroke,
	type InkTone,
	type InkWidth,
	inkPoint,
	PAD_HEIGHT,
	PAD_WIDTH,
	signatureToPng,
	strokePath,
	toneColors,
} from "./ink";
import { type SignaturePadVariant, signaturePad } from "./variants";

let {
	value = $bindable(),
	onValueChange,
	variant = "default",
	label = "Signature",
	hint = "Sign here",
	signer,
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
	/** Rests on the baseline until the first stroke. */
	hint?: string;
	/** Printed under the line, e.g. the signer's name. */
	signer?: string;
	/** Shows a Download button that saves a cropped PNG. */
	downloadable?: boolean;
	fileName?: string;
	disabled?: boolean;
	class?: string;
} = $props();

const TONES: InkTone[] = ["default", "primary"];
const WIDTHS: InkWidth[] = ["fine", "medium", "bold"];
const uid = $props.id();
const s = $derived(signaturePad({ variant }));
let pad = $state<HTMLDivElement | null>(null);
let own = $state<InkStroke[]>([]);
const strokes = $derived(value ?? own);
let undone = $state<InkStroke[]>([]);
let live = $state<InkStroke | null>(null);
let tone = $state<InkTone>("default");
let width = $state<InkWidth>("medium");
let wiping = $state(false);
let startedAt = 0;

function commit(next: InkStroke[]) {
	if (value === undefined) own = next;
	else value = next;
	onValueChange?.(next);
}
function undo() {
	const last = strokes.at(-1);
	if (!last) return;
	undone = [...undone, last];
	commit(strokes.slice(0, -1));
}
function redo() {
	const back = undone.at(-1);
	if (!back) return;
	undone = undone.slice(0, -1);
	commit([...strokes, back]);
}
function clear() {
	if (!strokes.length || wiping) return;
	wiping = true;
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

<div data-slot="signature-pad" data-variant={variant} class={cn(s.root(), className)}>
	<!-- The pad is a drawing surface (role=application): it takes focus, pointer ink and its shortcuts. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
	<div
		bind:this={pad}
		role="application"
		aria-roledescription="signature pad"
		aria-label={strokes.length ? `${label}, signed` : `${label}, empty`}
		aria-describedby="{uid}-keys"
		tabindex={disabled ? -1 : 0}
		class={s.surface()}
		onpointerdown={(event) => {
			if (disabled || wiping || !pad || event.button !== 0) return;
			event.currentTarget.setPointerCapture(event.pointerId);
			startedAt = event.timeStamp;
			live = add(event, { id: `${Date.now()}`, points: [], tone, width });
		}}
		onpointermove={(event) => {
			if (live) live = add(event, live);
		}}
		onpointerup={() => {
			if (!live) return;
			commit([...strokes, live]);
			undone = [];
			live = null;
		}}
		onpointercancel={() => (live = null)}
		onkeydown={(event) => {
			const action = historyKey(event);
			if (!action || disabled) return;
			event.preventDefault();
			if (action === "undo") undo();
			else if (action === "redo") redo();
			else clear();
		}}
	>
		<span aria-hidden="true" class={s.baseline()}></span>
		<span aria-hidden="true" data-hidden={Boolean(strokes.length || live)} class={s.hint()}>{hint}</span>
		{#if signer}<span aria-hidden="true" class={s.signer()}>{signer}</span>{/if}
		<svg
			aria-hidden="true"
			viewBox="0 0 {PAD_WIDTH} {PAD_HEIGHT}"
			data-wiping={wiping}
			class={s.ink()}
			ontransitionend={() => {
				if (!wiping) return;
				undone = [];
				commit([]);
				wiping = false;
			}}
		>
			{#each strokes as stroke (stroke.id)}
				<path d={strokePath(stroke)} data-tone={stroke.tone} class={s.stroke()} />
			{/each}
			{#if live}<path d={strokePath(live, false)} data-tone={live.tone} class={s.stroke()} />{/if}
		</svg>
	</div>
	<div class={s.toolbar()}>
		<div class={s.group()}>
			<ToggleGroup
				variant="segmented"
				size="sm"
				label="Ink"
				value={tone}
				onValueChange={(next) => {
					if (next === "default" || next === "primary") tone = next;
				}}
			>
				{#each TONES as item (item)}
					<ToggleGroupItem value={item} aria-label={item === "default" ? "Dark ink" : "Accent ink"}>
						<span aria-hidden="true" data-tone={item} class={s.swatch()}></span>
					</ToggleGroupItem>
				{/each}
			</ToggleGroup>
			<ToggleGroup
				variant="segmented"
				size="sm"
				label="Pen width"
				value={width}
				onValueChange={(next) => {
					const picked = WIDTHS.find((item) => item === next);
					if (picked) width = picked;
				}}
			>
				{#each WIDTHS as item (item)}
					<ToggleGroupItem value={item} class="capitalize">{item}</ToggleGroupItem>
				{/each}
			</ToggleGroup>
		</div>
		<div class={s.group()}>
			<Button size="sm" variant="ghost" onclick={undo} disabled={disabled || !strokes.length}>Undo</Button>
			<Button size="sm" variant="ghost" onclick={redo} disabled={disabled || !undone.length}>Redo</Button>
			<Button size="sm" variant="ghost" onclick={clear} disabled={disabled || !strokes.length}>Clear</Button>
			{#if downloadable}
				<Button
					size="sm"
					variant="outline"
					disabled={!strokes.length}
					onclick={async () => {
						if (!pad) return;
						downloadBlob(await signatureToPng(strokes, toneColors(pad)), `${fileName}.png`);
					}}
				>
					Download
				</Button>
			{/if}
		</div>
	</div>
	<p id="{uid}-keys" class="sr-only">
		Draw with a pointer or pen. Mod plus Z undoes, Shift plus Mod plus Z redoes, Delete clears.
	</p>
</div>
