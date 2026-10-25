<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type ChangeSummaryVariant, changeSummary } from "../variants";
import { setChangeSummary } from "./context";

let {
	variant = "tray",
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & {
	variant?: ChangeSummaryVariant;
	children?: Snippet;
} = $props();

const titleId = $props.id();
const styles = $derived(changeSummary({ variant }));

setChangeSummary({
	titleId,
	get styles() {
		return styles;
	},
});
</script>

<!-- The root: a labelled section holding the header and the list of changes. -->
<section
	data-slot="change-summary"
	data-variant={variant}
	aria-labelledby={titleId}
	{...rest}
	class={cn(styles.root(), classProp)}
>
	{@render children?.()}
</section>
