<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import {
	type BeamGeometry,
	type BeamLink,
	type BeamPoint,
	beamGeometry,
} from "../animated-beam-core";
import {
	type AnimatedBeamLayout,
	type AnimatedBeamSize,
	type AnimatedBeamTone,
	animatedBeam,
} from "../variants";
import { type AnimatedBeamNode, setAnimatedBeam } from "./context";

let {
	nodes,
	beams,
	center,
	layout = "hub",
	size = "md",
	tone = "primary",
	curvature = 24,
	class: className,
	children,
}: {
	nodes: AnimatedBeamNode[];
	/** Which nodes a beam joins; a node can sit on several beams. */
	beams: BeamLink[];
	/** Id of the hub (or, in a row, the target); defaults to the first node. */
	center?: string;
	layout?: AnimatedBeamLayout;
	size?: AnimatedBeamSize;
	tone?: AnimatedBeamTone;
	/** How far each beam bows away from a straight line, in px. */
	curvature?: number;
	class?: string;
	children?: Snippet;
} = $props();

const styles = $derived(animatedBeam({ layout, size, tone }));
const centreId = $derived(center ?? nodes[0]?.id);
const hub = $derived(nodes.find((n) => n.id === centreId));
const satellites = $derived(nodes.filter((n) => n.id !== centreId));

let root = $state<HTMLDivElement>();
let geometry = $state<BeamGeometry[]>([]);

// Centres come from the rendered nodes, so any layout, size or label change stays aligned.
function measure() {
	const el = root;
	if (!el) return;
	const box = el.getBoundingClientRect();
	const centres = new Map<string, BeamPoint>();
	for (const node of el.querySelectorAll<HTMLElement>("[data-beam-node]")) {
		const r = node.getBoundingClientRect();
		centres.set(node.dataset.beamNode ?? "", {
			x: r.left - box.left + r.width / 2,
			y: r.top - box.top + r.height / 2,
		});
	}
	geometry = beamGeometry(beams, centres, curvature);
}

$effect(() => {
	const el = root;
	if (!el) return;
	void [beams, curvature, nodes, layout, size];
	measure();
	const observer = new ResizeObserver(measure);
	observer.observe(el);
	return () => observer.disconnect();
});

setAnimatedBeam({
	get layout() {
		return layout;
	},
	get hub() {
		return hub;
	},
	get satellites() {
		return satellites;
	},
	get geometry() {
		return geometry;
	},
	get styles() {
		return styles;
	},
	measure,
});
</script>

<!-- Holds the nodes and beams and measures node centres; compose Beams and Nodes inside. -->
<div bind:this={root} data-slot="animated-beam" class={cn(styles.root(), className)}>
	{@render children?.()}
</div>
