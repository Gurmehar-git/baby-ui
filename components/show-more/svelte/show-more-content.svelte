<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { showMore } from "../variants";
import { showMoreState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const clamp = showMoreState();
const styles = showMore();
let content = $state<HTMLDivElement>();

$effect(() => {
	const el = content;
	if (!el) return;
	const measure = () => {
		const computed = getComputedStyle(el);
		const parsed = Number.parseFloat(computed.lineHeight);
		clamp.setMetrics(
			Number.isFinite(parsed) ? parsed : Number.parseFloat(computed.fontSize) * 1.5,
			el.scrollHeight,
		);
	};
	measure();
	const observer = new ResizeObserver(measure);
	observer.observe(el);
	return () => observer.disconnect();
});
</script>

<!-- The clamped region, with a veil at the bottom while there is more to read. -->
<div {...rest} class={cn(styles.content(), classProp)}>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		data-slot="show-more-content"
		bind:this={clamp.region}
		id={clamp.regionId}
		role={clamp.scrollable ? "region" : undefined}
		aria-label={clamp.scrollable ? clamp.label : undefined}
		tabindex={clamp.scrollable ? 0 : undefined}
		style:height={clamp.height === undefined ? undefined : `${clamp.height}px`}
		style:max-height={clamp.height === undefined ? `${clamp.lines}lh` : undefined}
		style:overflow-y={clamp.scrollable ? "auto" : "hidden"}
		style:scrollbar-gutter={clamp.scrollable ? "stable" : undefined}
		class={styles.region()}
	>
		<div bind:this={content}>{@render children?.()}</div>
	</div>
	<div
		data-slot="show-more-fade"
		aria-hidden="true"
		data-on={clamp.expandable && (!clamp.open || clamp.scrollable)}
		class={styles.fade()}
	></div>
</div>
