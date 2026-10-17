<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type CtaSectionVariant, ctaSection } from "../variants";
import { setCtaSection } from "./context";

let {
	variant = "centered",
	open = $bindable(),
	onOpenChange,
	class: className,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & {
	/** `centered` closes a page, `split` sits beside a visual, `banner` is one line. */
	variant?: CtaSectionVariant;
	/** Banner: whether it is shown; folds closed when false. Bindable. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: Snippet;
} = $props();

const titleId = $props.id();
const styles = $derived(ctaSection({ variant }));
let ownOpen = $state(true);
const shown = $derived(open ?? ownOpen);

setCtaSection({
	get variant() {
		return variant;
	},
	titleId,
	get styles() {
		return styles;
	},
	close() {
		if (open === undefined) ownOpen = false;
		else open = false;
		onOpenChange?.(false);
	},
});
</script>

<!-- CtaSectionContent beside CtaSectionVisual in split; the banner adds CtaSectionDismiss. -->
<section
	data-slot="cta-section"
	data-variant={variant}
	aria-labelledby={titleId}
	{...rest}
	class={cn(styles.root(), className)}
>
	{#if variant === "banner"}
		<div data-open={shown} inert={!shown} class={styles.collapse()}>
			<div class={styles.collapseInner()}>
				<div class={styles.wrap()}>
					<div class={styles.banner()}>{@render children?.()}</div>
				</div>
			</div>
		</div>
	{:else}
		<div class={styles.wrap()}>
			<div class={styles.panel()}>{@render children?.()}</div>
		</div>
	{/if}
</section>
