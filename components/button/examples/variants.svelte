<script lang="ts">
import {
	Button,
	type ButtonSize,
	type ButtonVariant,
} from "@baby-ui/components/svelte/button";

let {
	variant = "default",
	size = "default",
}: { variant?: ButtonVariant; size?: ButtonSize } = $props();
</script>

<Button {variant} {size}>Deploy project</Button>
