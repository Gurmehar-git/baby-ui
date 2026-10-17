<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import {
	type GradientHero01Size,
	type GradientHero01Tone,
	gradientHero01,
} from "../variants";
import { setGradientHero01 } from "./context";

let {
	tone = "chart",
	size = "screen",
	class: className,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & {
	tone?: GradientHero01Tone;
	size?: GradientHero01Size;
	children?: Snippet;
} = $props();

const styles = $derived(gradientHero01({ tone, size }));
setGradientHero01({
	get styles() {
		return styles;
	},
});
</script>

<!-- GradientHero01Content over a soft glow; a GradientHero01Media child switches to a split layout. -->
<section data-slot="gradient-hero-01" {...rest} class={cn(styles.root(), className)}>
	<div aria-hidden="true" class={styles.blob()}></div>
	<div aria-hidden="true" class={styles.wash()}></div>
	<div aria-hidden="true" class={styles.vignette()}></div>
	<div aria-hidden="true" class={styles.fade()}></div>
	<div class={styles.inner()}>{@render children?.()}</div>
</section>
