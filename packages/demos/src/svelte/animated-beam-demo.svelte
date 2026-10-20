<script lang="ts">
import {
	AnimatedBeam,
	AnimatedBeamBeams,
	type AnimatedBeamLayout,
	AnimatedBeamNodes,
	type AnimatedBeamSize,
	type AnimatedBeamTone,
} from "@baby-ui/svelte";
import { INTEGRATION_BEAMS, INTEGRATION_NODES } from "../data/animated-beam";

let { props = {} }: { props?: Record<string, unknown> } = $props();

const layout = $derived((props.layout as AnimatedBeamLayout) ?? "hub");
</script>

<div class={layout === "hub" ? "w-full max-w-2xl" : "w-full max-w-md"}>
	<AnimatedBeam
		nodes={INTEGRATION_NODES}
		beams={INTEGRATION_BEAMS}
		center="app"
		{layout}
		size={(props.size as AnimatedBeamSize) ?? "md"}
		tone={(props.tone as AnimatedBeamTone) ?? "primary"}
		curvature={typeof props.curvature === "number" ? props.curvature : 24}
	>
		<AnimatedBeamBeams />
		<AnimatedBeamNodes
			showLabels={props.showLabels === true}
			label={typeof props.label === "string" && props.label ? props.label : "Integrations"}
		/>
	</AnimatedBeam>
</div>
