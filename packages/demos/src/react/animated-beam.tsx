"use client";

import {
	AnimatedBeam,
	AnimatedBeamBeams,
	type AnimatedBeamLayout,
	AnimatedBeamNodes,
	type AnimatedBeamSize,
	type AnimatedBeamTone,
} from "@baby-ui/react";
import { INTEGRATION_BEAMS, INTEGRATION_NODES } from "../data/animated-beam";

export function AnimatedBeamDemo({ props }: { props: Record<string, unknown> }) {
	const layout = (props.layout as AnimatedBeamLayout) ?? "hub";
	return (
		<div className={layout === "hub" ? "w-full max-w-2xl" : "w-full max-w-md"}>
			<AnimatedBeam
				nodes={INTEGRATION_NODES}
				beams={INTEGRATION_BEAMS}
				center="app"
				layout={layout}
				size={(props.size as AnimatedBeamSize) ?? "md"}
				tone={(props.tone as AnimatedBeamTone) ?? "primary"}
				curvature={typeof props.curvature === "number" ? props.curvature : 24}
			>
				<AnimatedBeamBeams />
				<AnimatedBeamNodes
					showLabels={props.showLabels === true}
					label={
						typeof props.label === "string" && props.label ? props.label : "Integrations"
					}
				/>
			</AnimatedBeam>
		</div>
	);
}
