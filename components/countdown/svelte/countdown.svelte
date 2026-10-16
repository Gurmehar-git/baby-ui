<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/svelte/cn";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import {
	type CountdownUnit,
	countdownParts,
	createCountdownClock,
	sortUnits,
	spokenCountdown,
	toEpoch,
	UNIT_NAMES,
} from "./clock";
import { type CountdownVariant, countdown } from "./variants";

let {
	target,
	timeZone,
	units = ["days", "hours", "minutes", "seconds"],
	completeLabel = "Live now",
	complete: completeSnippet,
	onComplete,
	label = "Time remaining",
	clock = () => Date.now(),
	variant = "default",
	class: classProp,
}: {
	/** Epoch ms, a Date, or an ISO string; a string without an offset is wall time in `timeZone`, or UTC. */
	target: Date | number | string;
	/** IANA zone for a target string without an offset, such as "America/Los_Angeles". */
	timeZone?: string;
	/** Units to show; the largest absorbs the rest, so hours pass 24 when days are left out. */
	units?: CountdownUnit[];
	/** Shown and announced once the target passes. */
	completeLabel?: string;
	/** Replaces the finished label's content. */
	complete?: Snippet;
	/** Fires once when the countdown reaches zero while mounted, even in a hidden tab. */
	onComplete?: () => void;
	/** Accessible name, such as "Keynote starts in". */
	label?: string;
	/** Clock source in epoch ms; pass a server-synced clock when device time cannot be trusted. */
	clock?: () => number;
	variant?: CountdownVariant;
	class?: string;
} = $props();

let root = $state<HTMLDivElement>();
let now = $state<number | null>(null);
let armed: number | null = null;
const end = $derived(toEpoch(target, timeZone));
const valid = $derived(Number.isFinite(end));

$effect(() => {
	if (!root || !valid) return;
	return createCountdownClock(
		root,
		end,
		() => clock(),
		(time) => (now = time),
	);
});

const left = $derived(now === null || !valid ? null : Math.max(0, end - now));
$effect(() => {
	if (left === null) return;
	if (left > 0) {
		armed = end;
		return;
	}
	if (armed === end) {
		armed = null;
		onComplete?.();
	}
});

const done = $derived(left === 0);
const seconds = $derived(left === null ? 0 : Math.ceil(left / 1000));
const parts = $derived(countdownParts(seconds, sortUnits(units)));
const compact = $derived(variant !== "default");
const s = $derived(countdown({ variant }));
const spoken = $derived(
	done ? completeLabel : left === null ? "" : spokenCountdown(parts, seconds),
);
</script>

<div
	bind:this={root}
	role="timer"
	aria-label={label}
	data-slot="countdown"
	data-complete={done || undefined}
	data-pending={left === null || undefined}
	class={cn(s.root(), classProp)}
>
	<div aria-hidden="true" class={s.shell()}>
		<span data-on={!done} class={s.units()}>
			{#each parts as part, index (part.unit)}
				<span class={s.unit()}>
					{#if !compact && index > 0}<span class={s.colon()}>:</span>{/if}
					<span class={s.group()}>
						<RollingDigits value={part.value} pad={2} direction="down" startOnView={false} class={s.number()} />
						<span class={s.name()}>{UNIT_NAMES[part.unit][compact ? 1 : 0]}</span>
					</span>
				</span>
			{/each}
		</span>
		<span data-on={done} class={s.done()}>
			<span class={s.pulse()}><span class={s.ping()}></span></span>
			{#if completeSnippet}{@render completeSnippet()}{:else}{completeLabel}{/if}
		</span>
	</div>
	<span class="sr-only">{spoken}</span>
</div>
