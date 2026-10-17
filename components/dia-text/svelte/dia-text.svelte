<script lang="ts">
import { cn } from "../../lib/cn";
import { DIA_TEXT_COLORS, type DiaTextSize, diaGradient, diaText } from "../variants";

let {
	text,
	colors = DIA_TEXT_COLORS,
	textColor = "var(--foreground)",
	index: indexProp,
	defaultIndex = 0,
	onIndexChange,
	durationMs = 1500,
	delayMs = 0,
	repeat = false,
	repeatDelayMs = 500,
	triggerOnView = true,
	fixedWidth = false,
	size = "inherit",
	class: className,
}: {
	/** One string, or several to cycle through when `repeat` is on. */
	text: string | string[];
	/** Band colours, left to right. */
	colors?: string[];
	/** Colour the text settles to behind the band. */
	textColor?: string;
	/** Controlled: which string is showing. */
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
	/** One sweep, in ms. */
	durationMs?: number;
	delayMs?: number;
	/** Sweep again after each pass, moving to the next string. */
	repeat?: boolean;
	repeatDelayMs?: number;
	/** Wait until scrolled into view before the first sweep. */
	triggerOnView?: boolean;
	/** Keep the widest string's width instead of resizing per string. */
	fixedWidth?: boolean;
	size?: DiaTextSize;
	class?: string;
} = $props();

type Run = { index: number; key: number; swapped: boolean };

const texts = $derived(Array.isArray(text) ? text : [text]);
const count = $derived(texts.length);
const multi = $derived(count > 1);
let root = $state<HTMLSpanElement | null>(null);
let measure = $state<HTMLSpanElement | null>(null);
// svelte-ignore state_referenced_locally -- one-time seed, like React's useState(initialValue)
let internalIndex = $state(defaultIndex);
const index = $derived(
	count > 0 ? (((indexProp ?? internalIndex) % count) + count) % count : 0,
);
let seen = $state(false);
const visible = $derived(!triggerOnView || seen);
let widths = $state<number[]>([]);
// svelte-ignore state_referenced_locally -- seeded once; later changes flow through the effect
let run = $state<Run>({ index, key: 0, swapped: false });
let timer: ReturnType<typeof setTimeout> | undefined;

$effect.pre(() => {
	if (run.index !== index) run = { index, key: run.key + 1, swapped: true };
});

$effect(() => {
	if (!triggerOnView) return;
	const el = root;
	if (!el) return;
	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry?.isIntersecting) return;
			seen = true;
			observer.disconnect();
		},
		{ threshold: 0.1 },
	);
	observer.observe(el);
	return () => observer.disconnect();
});

$effect(() => {
	const el = measure;
	void texts;
	if (!(el && multi)) {
		widths = [];
		return;
	}
	const read = () => {
		widths = Array.from(el.children, (child) => (child as HTMLElement).offsetWidth);
	};
	read();
	const observer = new ResizeObserver(read);
	observer.observe(el);
	return () => observer.disconnect();
});

$effect(() => () => clearTimeout(timer));

function onSweepEnd(event: AnimationEvent) {
	if (event.animationName !== "dia-text-sweep" || !repeat) return;
	timer = setTimeout(() => {
		if (!multi) {
			run = { ...run, key: run.key + 1, swapped: false };
			return;
		}
		const next = (index + 1) % count;
		if (indexProp === undefined) internalIndex = next;
		onIndexChange?.(next);
	}, repeatDelayMs);
}

const styles = $derived(diaText({ multi, size }));
const width = $derived(
	!multi || widths.length === 0
		? undefined
		: fixedWidth
			? Math.max(...widths)
			: widths[index],
);
</script>

{#if count > 0}
	<span
		bind:this={root}
		data-slot="dia-text"
		class={cn(styles.root(), className)}
		style:width={width === undefined ? undefined : `${width}px`}
	>
		{#if multi}
			<span bind:this={measure} aria-hidden="true" class={styles.measure()}>
				{#each texts as t, i (i)}
					<span class="inline-block">{t}</span>
				{/each}
			</span>
		{/if}
		{#key run.key}
			<span aria-hidden="true" class={cn(styles.swap(), run.swapped && "dia-text-swap")}>
				<span
					class={cn(styles.sweep(), visible && "dia-text-sweep")}
					onanimationend={onSweepEnd}
					style:background-image={diaGradient(colors, textColor)}
					style:--dia-duration="{durationMs}ms"
					style:--dia-delay="{delayMs}ms">{texts[index]}</span
				>
			</span>
		{/key}
		<span class={styles.srOnly()}>{texts[index]}</span>
	</span>
{/if}
