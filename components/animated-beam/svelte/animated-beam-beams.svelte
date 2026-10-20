<script lang="ts">
import { cn } from "../../lib/cn";
import { pulseDasharray, pulseKeyframes } from "../animated-beam-core";
import { animatedBeamState } from "./context";

let { class: className }: { class?: string } = $props();

const ctx = animatedBeamState("AnimatedBeamBeams");
const uid = $props.id();
let svg = $state<SVGSVGElement>();

// Pulses run on the Web Animations API so they can pause offscreen and in hidden tabs.
$effect(() => {
	const el = svg;
	const geometry = ctx.geometry;
	if (!el || geometry.length === 0) return;
	if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
	const animations = [...el.querySelectorAll<SVGPathElement>("[data-beam-pulse]")].map(
		(path, i) => {
			const length = path.getTotalLength();
			path.style.strokeDasharray = pulseDasharray(length);
			const beam = geometry[i];
			return path.animate(pulseKeyframes(length), {
				duration: beam?.duration,
				delay: beam?.delay,
				iterations: Number.POSITIVE_INFINITY,
				easing: "cubic-bezier(0.45, 0, 0.55, 1)",
				fill: "backwards",
			});
		},
	);
	let visible = true;
	const sync = () => {
		const run = visible && !document.hidden;
		for (const a of animations) {
			if (run) a.play();
			else a.pause();
		}
	};
	const io = new IntersectionObserver((entries) => {
		visible = entries.some((e) => e.isIntersecting);
		sync();
	});
	io.observe(el);
	document.addEventListener("visibilitychange", sync);
	return () => {
		io.disconnect();
		document.removeEventListener("visibilitychange", sync);
		for (const a of animations) a.cancel();
	};
});
</script>

<!-- The beams: a quiet track per link with a gradient pulse travelling along it. -->
<svg
	bind:this={svg}
	aria-hidden="true"
	data-slot="animated-beam-beams"
	class={cn(ctx.styles.svg(), className)}
>
	<defs>
		{#each ctx.geometry as beam, i (beam.key)}
			<linearGradient
				id="{uid}-beam-{i}"
				gradientUnits="userSpaceOnUse"
				x1={beam.start.x}
				y1={beam.start.y}
				x2={beam.end.x}
				y2={beam.end.y}
			>
				<stop offset="0%" style="stop-color: var(--beam-a)" stop-opacity="0" />
				<stop offset="45%" style="stop-color: var(--beam-a)" />
				<stop offset="100%" style="stop-color: var(--beam-b)" />
			</linearGradient>
		{/each}
	</defs>
	{#each ctx.geometry as beam, i (beam.key)}
		<path d={beam.d} class={ctx.styles.track()} />
		<path
			data-beam-pulse=""
			d={beam.d}
			stroke="url(#{uid}-beam-{i})"
			class={ctx.styles.pulse()}
		/>
	{/each}
</svg>
