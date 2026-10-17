<script lang="ts">
import Button from "../../button/svelte/button.svelte";
import { ctaSectionState } from "./context";

let {
	"aria-label": ariaLabel = "Dismiss",
	class: classProp,
}: { "aria-label"?: string; class?: string } = $props();
const cta = ctaSectionState();
</script>

<!-- The banner's close button; folds the banner away. -->
<Button
	data-slot="cta-section-dismiss"
	size="icon-sm"
	variant="ghost"
	aria-label={ariaLabel}
	onclick={cta.close}
	class={classProp}
>
	<svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
		<path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
</Button>
