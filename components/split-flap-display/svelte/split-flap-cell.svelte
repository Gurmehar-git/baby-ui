<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { flapSteps, prefersReducedMotion } from "./flap";
import type { splitFlap } from "./variants";

let {
	char,
	delayMs,
	stepMs,
	characters,
	styles,
}: {
	char: string;
	delayMs: number;
	stepMs: number;
	characters: string;
	styles: ReturnType<typeof splitFlap>;
} = $props();

let current = $state(" ");
let prev = $state(" ");
let step = $state(0);
let flipping = $state(false);

$effect(() => {
	const target = char;
	const settle = () => {
		if (!flipping) return;
		prev = current;
		flipping = false;
	};
	const steps = flapSteps(
		untrack(() => current),
		target,
		characters,
	);
	if (prefersReducedMotion()) {
		current = target;
		prev = target;
		step = 0;
		flipping = false;
		return;
	}
	let i = 0;
	const tick = () => {
		const next = steps[i++] ?? target;
		prev = current;
		current = next;
		step += 1;
		flipping = true;
		timer = setTimeout(i < steps.length ? tick : settle, stepMs);
	};
	// An interrupted flip still lands before the halves collapse to one glyph.
	let timer = setTimeout(
		steps.length > 0 ? tick : settle,
		steps.length > 0 ? delayMs : stepMs,
	);
	return () => clearTimeout(timer);
});
</script>

{#snippet half(className: string, glyph: string)}
	<span class={className}><span class={styles.char()}>{glyph}</span></span>
{/snippet}

<span class={styles.cell()}>
	<span class={styles.tile()}>
		<span class={styles.top()}>{@render half(styles.glyphTop(), current)}</span>
		<span class={styles.bottom()}>{@render half(styles.glyphBottom(), prev)}</span>
		{#if flipping}
			{#key step}
				<span class={cn(styles.top(), styles.flapTop())}>
					{@render half(styles.glyphTop(), prev)}
				</span>
				<span class={cn(styles.bottom(), styles.flapBottom())}>
					{@render half(styles.glyphBottom(), current)}
				</span>
			{/key}
		{/if}
		<span class={styles.divider()}></span>
	</span>
</span>
