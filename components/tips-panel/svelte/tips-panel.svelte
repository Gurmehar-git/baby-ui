<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type TipsPanelVariant, tipsPanel } from "../variants";
import { setTipsPanel } from "./context";

let {
	value = $bindable([]),
	onValueChange,
	variant = "tray",
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & {
	/** Ids of the tips already taken. Bindable. */
	value?: string[];
	onValueChange?: (value: string[]) => void;
	variant?: TipsPanelVariant;
	children?: Snippet;
} = $props();

const titleId = $props.id();
const styles = $derived(tipsPanel({ variant }));
let tips = $state<string[]>([]);

setTipsPanel({
	titleId,
	get done() {
		return value;
	},
	get tips() {
		return tips;
	},
	get styles() {
		return styles;
	},
	markDone(tip) {
		if (value.includes(tip)) return;
		value = [...value, tip];
		onValueChange?.(value);
	},
	register(tip) {
		if (!tips.includes(tip)) tips = [...tips, tip];
		return () => {
			tips = tips.filter((t) => t !== tip);
		};
	},
});
</script>

<!-- The root: which tips are done, and the count of tips placed inside it. -->
<section
	data-slot="tips-panel"
	data-variant={variant}
	aria-labelledby={titleId}
	{...rest}
	class={cn(styles.root(), classProp)}
>
	{@render children?.()}
</section>
