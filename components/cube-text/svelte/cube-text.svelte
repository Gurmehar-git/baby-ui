<script lang="ts">
import { cn } from "../../lib/cn";
import {
	type CubeTextSize,
	type CubeTextStagger,
	cubeText,
	cubeWords,
} from "../variants";

let {
	text,
	durationMs = 2200,
	delayMs = 0,
	loop = true,
	stagger = "wave",
	size = "default",
	class: classProp,
}: {
	text: string;
	/** One roll, in ms; the glyph rolls in the first quarter and rests for the rest. */
	durationMs?: number;
	delayMs?: number;
	loop?: boolean;
	/** `wave` sweeps the roll across the text; `together` rolls every glyph at once. */
	stagger?: CubeTextStagger;
	size?: CubeTextSize;
	class?: string;
} = $props();

const s = $derived(cubeText({ size, stagger }));
const words = $derived(cubeWords(text, durationMs, delayMs, stagger));
</script>

<span data-slot="cube-text" class={cn(s.root(), classProp)}>
	<span class="sr-only">{text}</span>
	<!-- No whitespace between these tags: Svelte would render it as gaps between glyphs. -->
	<span aria-hidden="true"
		>{#each words as glyphs, w (w)}{#if w > 0}{" "}{/if}<span class={s.word()}
				>{#each glyphs as glyph, g (g)}<span
						data-char={glyph.char}
						class={s.char()}
						style:--cube-duration="{durationMs}ms"
						style:--cube-delay="{glyph.delayMs}ms"
						style:--cube-iterations={loop ? "infinite" : "1"}>{glyph.char}</span
					>{/each}</span
			>{/each}</span
	>
</span>
