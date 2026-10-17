"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import {
	type EmptyPhase,
	type EmptyScene,
	SCENE_FRAMES,
	SCENE_VIEW,
	SHAPE_KINDS,
} from "../art";
import { createIllustration, initialShapes } from "../illustration";
import { type EmptyIllustrationSize, emptyIllustration } from "../variants";

export type { EmptyIllustrationSize, EmptyPhase, EmptyScene };

export interface EmptyIllustrationProps {
	/** Which empty state to draw; changing it morphs every shape into the new scene. */
	scene: EmptyScene;
	/** `loading` and `done` show the scene's progress and resolved drawings. */
	phase?: EmptyPhase;
	size?: EmptyIllustrationSize;
	/** Accessible description; defaults to one written for the scene and phase. */
	label?: string;
	/** Drift a little with the pointer. */
	parallax?: boolean;
	className?: string;
}

/** One drawing for four empty states; shapes spring between scenes and phases instead of swapping. */
export function EmptyIllustration({
	scene,
	phase = "idle",
	size = "default",
	label,
	parallax = true,
	className,
}: EmptyIllustrationProps) {
	const s = emptyIllustration({ size });
	const paths = useRef<(SVGPathElement | null)[]>([]);
	const engine = useRef<ReturnType<typeof createIllustration> | null>(null);
	const shown = useRef({ scene, phase });
	const [initial] = useState(() => initialShapes(scene, phase));
	const reduced = useRef(false);
	// biome-ignore lint/correctness/useExhaustiveDependencies: the engine owns the paths after mount; scene changes go through go().
	useEffect(() => {
		reduced.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
		const nodes = paths.current.filter((node): node is SVGPathElement => node !== null);
		if (nodes.length !== SHAPE_KINDS.length) return;
		const instance = createIllustration(nodes, SCENE_FRAMES[scene][phase]);
		engine.current = instance;
		return () => instance.destroy();
	}, []);
	useEffect(() => {
		const prev = shown.current;
		if (prev.scene === scene && prev.phase === phase) return;
		shown.current = { scene, phase };
		engine.current?.go(SCENE_FRAMES[scene][phase], prev.scene !== scene, reduced.current);
	}, [scene, phase]);

	return (
		<div
			data-slot="empty-illustration"
			className={cn(s.root(), className)}
			onPointerMove={(event) => {
				if (!parallax || event.pointerType !== "mouse" || reduced.current) return;
				const box = event.currentTarget.getBoundingClientRect();
				engine.current?.pointer(
					((event.clientX - box.left) / box.width - 0.5) * 2,
					((event.clientY - box.top) / box.height - 0.5) * 2,
				);
			}}
			onPointerLeave={() => engine.current?.pointer(0, 0)}
		>
			<svg
				viewBox={`0 0 ${SCENE_VIEW.width} ${SCENE_VIEW.height}`}
				role="img"
				aria-label={label ?? SCENE_FRAMES[scene][phase].label}
				className={s.svg()}
			>
				{initial.map((shape, i) => (
					<path
						// biome-ignore lint/suspicious/noArrayIndexKey: the ten primitives keep their paint order.
						key={i}
						ref={(node) => {
							paths.current[i] = node;
						}}
						data-kind={SHAPE_KINDS[i]}
						data-tone={shape.tone}
						d={shape.d}
						opacity={shape.opacity}
						strokeDasharray={shape.dash}
						className={s.shape()}
					/>
				))}
			</svg>
		</div>
	);
}
