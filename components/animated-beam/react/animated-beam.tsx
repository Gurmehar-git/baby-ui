"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import {
	type BeamGeometry,
	type BeamLink,
	type BeamPoint,
	beamGeometry,
	hubPositions,
	pulseDasharray,
	pulseKeyframes,
} from "../animated-beam-core";
import {
	type AnimatedBeamLayout,
	type AnimatedBeamSize,
	type AnimatedBeamTone,
	animatedBeam,
} from "../variants";

export type AnimatedBeamNode = {
	id: string;
	/** Accessible name; shown under the node when AnimatedBeamNodes has `showLabels`. */
	label: string;
	/** Image URL for the node's mark; ignored when `icon` is given. */
	src?: string;
	icon?: ReactNode;
};

type BeamCtx = {
	layout: AnimatedBeamLayout;
	hub?: AnimatedBeamNode;
	satellites: AnimatedBeamNode[];
	geometry: BeamGeometry[];
	styles: ReturnType<typeof animatedBeam>;
	measure: () => void;
};

const BeamContext = createContext<BeamCtx | null>(null);

function useBeam(part: string): BeamCtx {
	const ctx = useContext(BeamContext);
	if (!ctx) throw new Error(`${part} must be used inside <AnimatedBeam>`);
	return ctx;
}

export interface AnimatedBeamProps {
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
	className?: string;
	children?: ReactNode;
}

/** Holds the nodes and beams and measures node centres; compose Beams and Nodes inside. */
export function AnimatedBeam({
	nodes,
	beams,
	center,
	layout = "hub",
	size = "md",
	tone = "primary",
	curvature = 24,
	className,
	children,
}: AnimatedBeamProps) {
	const styles = animatedBeam({ layout, size, tone });
	const centreId = center ?? nodes[0]?.id;
	const hub = nodes.find((n) => n.id === centreId);
	const satellites = nodes.filter((n) => n.id !== centreId);
	const root = useRef<HTMLDivElement>(null);
	const [geometry, setGeometry] = useState<BeamGeometry[]>([]);
	// Anything that moves a node re-measures, not just a container resize.
	const arrangement = `${layout}|${size}|${nodes.map((n) => n.id).join(",")}`;

	// Centres come from the rendered nodes, so any layout, size or label change stays aligned.
	const measure = useCallback(() => {
		const el = root.current;
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
		setGeometry(beamGeometry(beams, centres, curvature));
	}, [beams, curvature]);

	useEffect(() => {
		const el = root.current;
		if (!el) return;
		void arrangement;
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(el);
		return () => observer.disconnect();
	}, [measure, arrangement]);

	return (
		<BeamContext.Provider value={{ layout, hub, satellites, geometry, styles, measure }}>
			<div ref={root} data-slot="animated-beam" className={cn(styles.root(), className)}>
				{children}
			</div>
		</BeamContext.Provider>
	);
}

/** The beams: a quiet track per link with a gradient pulse travelling along it. */
export function AnimatedBeamBeams({ className }: { className?: string }) {
	const { geometry, styles } = useBeam("AnimatedBeamBeams");
	const uid = useId();
	const svg = useRef<SVGSVGElement>(null);

	// Pulses run on the Web Animations API so they can pause offscreen and in hidden tabs.
	useEffect(() => {
		const el = svg.current;
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
	}, [geometry]);

	return (
		<svg
			ref={svg}
			aria-hidden="true"
			data-slot="animated-beam-beams"
			className={cn(styles.svg(), className)}
		>
			<defs>
				{geometry.map((beam, i) => (
					<linearGradient
						key={beam.key}
						id={`${uid}-beam-${i}`}
						gradientUnits="userSpaceOnUse"
						x1={beam.start.x}
						y1={beam.start.y}
						x2={beam.end.x}
						y2={beam.end.y}
					>
						<stop offset="0%" style={{ stopColor: "var(--beam-a)" }} stopOpacity={0} />
						<stop offset="45%" style={{ stopColor: "var(--beam-a)" }} />
						<stop offset="100%" style={{ stopColor: "var(--beam-b)" }} />
					</linearGradient>
				))}
			</defs>
			{geometry.map((beam, i) => (
				<g key={beam.key}>
					<path d={beam.d} className={styles.track()} />
					<path
						data-beam-pulse=""
						d={beam.d}
						stroke={`url(#${uid}-beam-${i})`}
						className={styles.pulse()}
					/>
				</g>
			))}
		</svg>
	);
}

export interface AnimatedBeamNodesProps {
	/** Show each node's label under its mark; otherwise labels are for screen readers only. */
	showLabels?: boolean;
	/** Accessible name of the node list. */
	label?: string;
	className?: string;
}

/** The nodes as a labelled list: the hub in the middle (or at the end of a row). */
export function AnimatedBeamNodes({
	showLabels = false,
	label = "Integrations",
	className,
}: AnimatedBeamNodesProps) {
	const { layout, hub, satellites, styles, measure } = useBeam("AnimatedBeamNodes");
	const positions = hubPositions(satellites.length);

	// Labels move node centres in a row, so beams re-measure when they toggle.
	useEffect(() => {
		void showLabels;
		measure();
	}, [showLabels, measure]);

	const mark = (node: AnimatedBeamNode, isCenter: boolean) => (
		<>
			<div
				data-beam-node={node.id}
				className={isCenter ? styles.center() : styles.node()}
			>
				{node.icon ??
					(node.src ? (
						<img src={node.src} alt="" draggable={false} className={styles.icon()} />
					) : null)}
			</div>
			<span className={showLabels ? styles.label() : "sr-only"}>{node.label}</span>
		</>
	);

	return (
		<ul
			aria-label={label}
			data-slot="animated-beam-nodes"
			className={cn(styles.list(), className)}
		>
			{layout === "hub" ? (
				<>
					{hub ? <li className={styles.hubItem()}>{mark(hub, true)}</li> : null}
					{satellites.map((node, i) => (
						<li
							key={node.id}
							className={styles.satelliteItem()}
							style={{
								left: `${positions[i]?.x ?? 50}%`,
								top: `${positions[i]?.y ?? 50}%`,
							}}
						>
							{mark(node, false)}
						</li>
					))}
				</>
			) : (
				<>
					{satellites.map((node, i) => (
						<li
							key={node.id}
							className={styles.satelliteItem()}
							style={{ gridRow: i + 1 }}
						>
							{mark(node, false)}
						</li>
					))}
					{hub ? (
						<li
							className={styles.hubItem()}
							style={{ gridRow: `1 / span ${Math.max(1, satellites.length)}` }}
						>
							{mark(hub, true)}
						</li>
					) : null}
				</>
			)}
		</ul>
	);
}
