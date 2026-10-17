<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type LoadingStateVariant, loadingState } from "../variants";
import { setLoadingState } from "./context";

let {
	variant = "drive",
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	variant?: LoadingStateVariant;
	children?: Snippet;
} = $props();

const styles = $derived(loadingState({ variant }));
setLoadingState({
	get variant() {
		return variant;
	},
	get styles() {
		return styles;
	},
});
</script>

<!-- A status row from parts, with an optional LoadingStatePreview underneath. -->
<div data-slot="loading-state" role="status" {...rest} class={cn(styles.root(), classProp)}>
	{@render children?.()}
</div>
