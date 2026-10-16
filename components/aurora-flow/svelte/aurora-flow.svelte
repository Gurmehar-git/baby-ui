<script lang="ts">
import type { Snippet } from "svelte";
import AuroraField from "./aurora-field.svelte";
import type {
	AuroraFlowPosition,
	AuroraFlowSpeed,
	AuroraFlowTone,
	AuroraFlowVariant,
} from "./variants";

let {
	variant = "veil",
	...rest
}: {
	variant?: AuroraFlowVariant;
	tone?: AuroraFlowTone;
	speed?: AuroraFlowSpeed;
	position?: AuroraFlowPosition;
	/** Veil or ribbon strength, 0 to 2. */
	intensity?: number;
	/** Film grain, 0 to 1. Defaults per variant. */
	grain?: number;
	/** Veil: flow direction in degrees. */
	direction?: number;
	/** Veils bend, or ribbons lean, toward the pointer. */
	interactive?: boolean;
	class?: string;
	children?: Snippet;
} = $props();
</script>

<!-- Each variant is its own shader, so a switch remounts the canvas. -->
{#key variant}
	<AuroraField {variant} {...rest} />
{/key}
