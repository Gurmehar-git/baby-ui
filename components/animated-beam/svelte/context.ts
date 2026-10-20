import { getContext, hasContext, type Snippet, setContext } from "svelte";
import type { BeamGeometry } from "../animated-beam-core";
import type { AnimatedBeamLayout, animatedBeam } from "../variants";

export type AnimatedBeamNode = {
	id: string;
	/** Accessible name; shown under the node when AnimatedBeamNodes has `showLabels`. */
	label: string;
	/** Image URL for the node's mark; ignored when `icon` is given. */
	src?: string;
	icon?: Snippet;
};

export type AnimatedBeamState = {
	layout: AnimatedBeamLayout;
	hub?: AnimatedBeamNode;
	satellites: AnimatedBeamNode[];
	geometry: BeamGeometry[];
	styles: ReturnType<typeof animatedBeam>;
	measure: () => void;
};

const KEY = Symbol("animated-beam");

/** The root's state behind getters, so every part reads the latest value. */
export const setAnimatedBeam = (state: AnimatedBeamState) => setContext(KEY, state);
export function animatedBeamState(part: string): AnimatedBeamState {
	if (!hasContext(KEY)) throw new Error(`${part} must be used inside <AnimatedBeam>`);
	return getContext<AnimatedBeamState>(KEY);
}
