<script lang="ts">
import { untrack } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import Button from "../../button/svelte/button.svelte";
import CopyButton from "../../copy-button/svelte/copy-button.svelte";
import { cn } from "../../lib/cn";
import { keyGroups, LICENSE_KEY_LABELS, maskKey } from "../license-core";
import { getLicenseKey } from "./context";

let {
	revealLabel = LICENSE_KEY_LABELS.reveal,
	hideLabel = LICENSE_KEY_LABELS.hide,
	copyLabel = LICENSE_KEY_LABELS.copy,
	copiedLabel = LICENSE_KEY_LABELS.copied,
	class: classProp,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	revealLabel?: string;
	hideLabel?: string;
	copyLabel?: string;
	copiedLabel?: string;
} = $props();

const CHIP_STAGGER_MS = 50;
const PULSE_STAGGER_MS = 90;
// The flip's length in motion.css; a toggle inside it swaps at once instead of replaying.
const FLIP_MS = 360;
const ctx = getLicenseKey();
let beat = $state<{ n: number; kind: "flip" | "ring" | "wave" | "still" }>({
	n: 0,
	kind: "flip",
});
let last = untrack(() => ({
	licenseKey: ctx.licenseKey,
	revealed: ctx.revealed,
	at: Number.NEGATIVE_INFINITY,
}));
const rotating = $derived(ctx.status === "rotating");

$effect(() => {
	const licenseKey = ctx.licenseKey;
	const revealed = ctx.revealed;
	const keyChanged = last.licenseKey !== licenseKey;
	if (!keyChanged && last.revealed === revealed) return;
	const at = performance.now();
	const quick = at - last.at < FLIP_MS;
	last = { licenseKey, revealed, at };
	untrack(() => {
		beat = { n: beat.n + 1, kind: keyChanged ? "ring" : quick ? "still" : "flip" };
	});
});

const parts = $derived(
	keyGroups(ctx.revealed ? ctx.licenseKey : maskKey(ctx.licenseKey)),
);
</script>

<!-- The key as chips of four: they flip on reveal, ring on a new key, wave on copy and pulse while minting. -->
<div
	{...rest}
	data-slot="license-key-value"
	data-rotating={rotating ? "" : undefined}
	class={cn(ctx.styles.well(), classProp)}
>
	<code class={ctx.styles.value()}>
		<span class={ctx.styles.valuePrefix()}>{parts.prefix}</span>
		{#key beat.n}
			{#each parts.groups as group, g (g)}
				<span
					class={cn(
						ctx.styles.chip(),
						rotating
							? "license-pulse"
							: beat.n > 0 && beat.kind !== "still" && `license-${beat.kind}`,
					)}
					style:animation-delay="{g * (rotating ? PULSE_STAGGER_MS : CHIP_STAGGER_MS)}ms"
					>{group}</span
				>
			{/each}
		{/key}
	</code>
	<span class={ctx.styles.actions()}>
		<Button
			variant="ghost"
			size="icon-sm"
			aria-label={ctx.revealed ? hideLabel : revealLabel}
			aria-pressed={ctx.revealed}
			disabled={rotating}
			onclick={() => ctx.setRevealed(!ctx.revealed)}
			class={ctx.styles.action()}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.75"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
				<circle cx="12" cy="12" r="2.75" />
				<path
					d="m4 4 16 16"
					pathLength="1"
					class={ctx.styles.eyeSlash()}
					style:stroke-dashoffset={ctx.revealed ? 0 : 1}
				/>
			</svg>
		</Button>
		<!-- Capture, not a prop: CopyButton has no callback, and the wave only needs the click. -->
		<span class="contents" onclickcapture={() => (beat = { n: beat.n + 1, kind: "wave" })}>
			<CopyButton
				text={ctx.licenseKey}
				label={copyLabel}
				{copiedLabel}
				iconOnly
				class={ctx.styles.action()}
			/>
		</span>
	</span>
</div>
