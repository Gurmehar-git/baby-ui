<script lang="ts">
import { cn } from "../lib/cn";
import { typingStumbleSteps } from "./stumble";
import { type TypingTextSize, typingText } from "./variants";

let {
	text,
	delay = 32,
	repeat = true,
	waitMs = 1000,
	smooth = false,
	fadeDurationMs = 300,
	grow = false,
	hideCursorOnComplete = false,
	stumbles = false,
	onComplete,
	size = "default",
	class: classProp,
}: {
	text: string;
	delay?: number;
	repeat?: boolean;
	waitMs?: number;
	smooth?: boolean;
	/** How long each word's fade-in takes, in ms. Only applies when `smooth` is true. */
	fadeDurationMs?: number;
	grow?: boolean;
	hideCursorOnComplete?: boolean;
	/** Types like a person: wrong keys appear and get corrected. `delay` scales the pace. */
	stumbles?: boolean;
	onComplete?: () => void;
	size?: TypingTextSize;
	class?: string;
} = $props();

const stumbling = $derived(stumbles && !smooth);
const words = $derived(text.split(/\s+/));
const total = $derived(smooth ? words.length : text.length);

let index = $state(0);
let direction = $state<1 | -1>(1);
let completed = false;
let blinkOn = $state(true);

// Stumble mode: frames timed at a 32ms reference delay, scaled by `delay`.
let pass = $state(0);
let step = $state(0);
let reduced = $state(false);
const steps = $derived(typingStumbleSteps(text, pass));
const stumbleDone = $derived(step >= steps.length);

$effect(() => {
	text; // re-run whenever the text prop changes, not just on mount
	index = 0;
	direction = 1;
	completed = false;
	pass = 0;
	step = 0;
});

$effect(() => {
	const id = setInterval(() => {
		blinkOn = !blinkOn;
	}, 500);
	return () => clearInterval(id);
});

$effect(() => {
	const query = matchMedia("(prefers-reduced-motion: reduce)");
	reduced = query.matches;
	const update = () => (reduced = query.matches);
	query.addEventListener("change", update);
	return () => query.removeEventListener("change", update);
});

const atEnd = $derived(index >= total);
const atStart = $derived(index <= 0);
const paused = $derived((atEnd && direction === 1) || (atStart && direction === -1));

$effect(() => {
	if (stumbling || paused) return;
	const tick = Math.max(1, delay);
	const id = setInterval(() => {
		const next = index + direction;
		index = direction === 1 ? Math.min(next, total) : Math.max(next, 0);
	}, tick);
	return () => clearInterval(id);
});

$effect(() => {
	if (stumbling) return;
	if (atEnd && direction === 1) {
		if (!repeat) {
			if (!completed) {
				completed = true;
				onComplete?.();
			}
			return;
		}
		const id = setTimeout(() => {
			direction = -1;
		}, waitMs);
		return () => clearTimeout(id);
	}
	if (atStart && direction === -1 && repeat) {
		const id = setTimeout(() => {
			direction = 1;
		}, waitMs);
		return () => clearTimeout(id);
	}
});

$effect(() => {
	if (!stumbling || reduced) return;
	if (stumbleDone) {
		onComplete?.();
		if (!repeat) return;
		const id = setTimeout(() => {
			pass += 1;
			step = 0;
		}, waitMs);
		return () => clearTimeout(id);
	}
	const id = setTimeout(() => (step += 1), (steps[step]?.wait ?? 0) * (delay / 32));
	return () => clearTimeout(id);
});

const shown = $derived(
	stumbling
		? reduced || stumbleDone
			? text
			: (steps[step]?.text ?? "")
		: text.slice(0, index),
);
const isComplete = $derived(
	stumbling ? stumbleDone && !repeat : index === total && !repeat,
);
const showCursor = $derived(!smooth && (!hideCursorOnComplete || !isComplete));
const cursorSolid = $derived(stumbling ? stumbleDone : atEnd || atStart);
const classes = $derived(typingText({ size }));
</script>

<div data-slot="typing-text" class={cn(classes, classProp)} style="--tt-fade-duration: {fadeDurationMs}ms;">
	{#if stumbling}<span class="sr-only">{text}</span>{/if}
	{#if !grow}
		<div aria-hidden={stumbling || undefined} class="invisible">{text}</div>
	{/if}
	<div aria-hidden={stumbling || undefined} class={!grow ? "absolute inset-0" : undefined}>
		{#if smooth}
			<span class="flex flex-wrap whitespace-pre">
				{#each words as word, i (i)}
					<span class={cn("transition-opacity duration-[var(--tt-fade-duration,300ms)] ease-[var(--ease-ui-in-out)]", i < index ? "opacity-100" : "opacity-0")}>
						{word}{#if i < words.length - 1}<span>&nbsp;</span>{/if}
					</span>
				{/each}
			</span>
		{:else}
			{shown}
		{/if}
		{#if showCursor}<span class={blinkOn || cursorSolid ? "" : "opacity-0"}>|</span>{/if}
	</div>
</div>
