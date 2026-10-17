<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { baseVars, hoverLayers, styleString } from "../effects";
import {
	type HoverTransitionDirection,
	type HoverTransitionEffect,
	hoverTransition,
} from "../variants";

let {
	children,
	hoverContent,
	effect = "wipe",
	direction = "right",
	durationMs = 720,
	tilt = true,
	active = $bindable(false),
	onActiveChange,
	label = "Hover to reveal more",
	class: className,
}: {
	/** Resting content. */
	children: Snippet;
	/** Content revealed on hover or keyboard focus. */
	hoverContent: Snippet;
	effect?: HoverTransitionEffect;
	/** Where the reveal starts or which way it travels. */
	direction?: HoverTransitionDirection;
	durationMs?: number;
	/** Tilt a couple of degrees toward a mouse pointer. */
	tilt?: boolean;
	/** Whether the hover content is shown; bindable. */
	active?: boolean;
	onActiveChange?: (active: boolean) => void;
	/** Accessible name of the focusable wrapper. */
	label?: string;
	class?: string;
} = $props();

const MAX_TILT = 2.4;

const styles = $derived(hoverTransition({ effect, direction }));
const layers = $derived(hoverLayers(effect, direction, active));
const firstHover = $derived(layers.findIndex((layer) => layer.content === "hover"));

function setActive(next: boolean) {
	if (next === active) return;
	active = next;
	onActiveChange?.(next);
}

function track(event: PointerEvent & { currentTarget: HTMLDivElement }) {
	if (!tilt || event.pointerType !== "mouse") return;
	const box = event.currentTarget.getBoundingClientRect();
	const x = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
	const y = Math.min(1, Math.max(0, (event.clientY - box.top) / box.height));
	event.currentTarget.style.setProperty(
		"--ht-tilt-x",
		`${((0.5 - y) * MAX_TILT).toFixed(2)}deg`,
	);
	event.currentTarget.style.setProperty(
		"--ht-tilt-y",
		`${((x - 0.5) * MAX_TILT).toFixed(2)}deg`,
	);
}

function untilt(event: PointerEvent & { currentTarget: HTMLDivElement }) {
	event.currentTarget.style.setProperty("--ht-tilt-x", "0deg");
	event.currentTarget.style.setProperty("--ht-tilt-y", "0deg");
}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	data-slot="hover-transition"
	data-effect={effect}
	data-active={active ? "true" : "false"}
	role="group"
	aria-label={label}
	tabindex="0"
	class={cn(styles.root(), className)}
	style="--ht-duration: {durationMs}ms;"
	onmouseenter={() => setActive(true)}
	onmouseleave={() => setActive(false)}
	onfocus={() => setActive(true)}
	onblur={(event) => {
		if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(false);
	}}
	onpointermove={track}
	onpointerleave={untilt}
>
	<div data-active={active ? "true" : "false"} class={styles.stage()}>
		<div
			aria-hidden={active ? true : undefined}
			inert={active}
			class={styles.base()}
			style={styleString(baseVars(effect, active))}
		>
			{@render children()}
		</div>
		{#each layers as layer, i (i)}
			<div
				data-exposed={i === firstHover && active ? "true" : undefined}
				aria-hidden={i === firstHover && active ? undefined : true}
				inert={!(i === firstHover && active)}
				class={styles.layer()}
				style={styleString(layer.vars)}
			>
				{#if layer.inner}
					<div class={styles.inner()} style={styleString(layer.inner)}>
						{#if layer.content === "hover"}{@render hoverContent()}{:else}{@render children()}{/if}
					</div>
				{:else if layer.content === "hover"}
					{@render hoverContent()}
				{:else}
					{@render children()}
				{/if}
			</div>
		{/each}
	</div>
</div>
