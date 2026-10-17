<script lang="ts">
import type { ComponentProps } from "svelte";
import ButtonGroup from "../../button-group/svelte/button-group.svelte";
import { type SplitButtonSize, type SplitButtonVariant, splitButton } from "../variants";
import { setSplitButton } from "./context";

let {
	variant = "default",
	size = "default",
	disabled = false,
	...rest
}: ComponentProps<typeof ButtonGroup> & {
	variant?: SplitButtonVariant;
	size?: SplitButtonSize;
	disabled?: boolean;
} = $props();

const styles = $derived(splitButton({ variant, size }));
setSplitButton({
	get variant() {
		return variant;
	},
	get size() {
		return size;
	},
	get disabled() {
		return disabled;
	},
	get styles() {
		return styles;
	},
});
</script>

<!-- SplitButtonAction, then SplitButtonMenu with SplitButtonTrigger and SplitButtonContent. -->
<ButtonGroup data-slot="split-button" {...rest} />
