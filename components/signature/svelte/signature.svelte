<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { type SignatureVariant, signature, signatureTiming } from "./variants";

let {
	text,
	variant = "ink",
	duration = 2,
	delay = 0,
	strokeWidth = 1,
	inView = false,
	once = true,
	class: classProp,
}: {
	text: string;
	/** `ink` fills each glyph after its stroke; `outline` keeps the stroke only. */
	variant?: SignatureVariant;
	/** Seconds across the whole text. */
	duration?: number;
	/** Seconds before the first glyph starts. */
	delay?: number;
	/** Outline stroke width, in px. */
	strokeWidth?: number;
	/** Wait until the element scrolls into view. */
	inView?: boolean;
	/** With `inView`, play only the first time; otherwise replay on every entry. */
	once?: boolean;
	/** Set a script font here; the SVG inherits the element's font. */
	class?: string;
} = $props();

let root = $state<HTMLSpanElement>();
let visible = $state(true);
let run = $state(0);
const s = $derived(signature({ variant }));
const chars = $derived(Array.from(text));
const timing = $derived(
	Object.entries(signatureTiming(chars.length, duration, delay))
		.map(([k, v]) => `${k}: ${v}`)
		.join("; "),
);

$effect(() => {
	const el = root;
	if (!inView || !el || typeof IntersectionObserver === "undefined") {
		visible = true;
		return;
	}
	const replay = !once;
	visible = false;
	const io = new IntersectionObserver(([entry]) => {
		if (entry?.isIntersecting) {
			visible = true;
			if (!replay) io.disconnect();
		} else if (replay) {
			visible = false;
			run += 1;
		}
	});
	io.observe(el);
	return () => io.disconnect();
});
</script>

<span
	bind:this={root}
	data-slot="signature"
	data-state={visible ? "play" : "idle"}
	class={cn(s.root(), classProp)}
	style={timing}
>
	<span class={s.ghost()}>{text}</span>
	{#key `${text}-${run}`}
		<svg aria-hidden="true" class={s.svg()}>
			<text
				x="0.1em"
				y="50%"
				dominant-baseline="central"
				stroke-width={strokeWidth}
				class={s.text()}
			>
				{#each chars as char, i (`${char}-${i}`)}<tspan class={s.glyph()} style:--signature-i={i}
						>{char}</tspan
					>{/each}
			</text>
		</svg>
	{/key}
</span>
