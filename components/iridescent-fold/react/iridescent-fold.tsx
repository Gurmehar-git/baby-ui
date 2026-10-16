"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/react/cn";
import { useCanvasEngine } from "../../lib/react/use-canvas-engine";
import { type IridescentFoldOptions, mountIridescentFold } from "./fold";
import {
	IRIDESCENT_FOLD_COLORS,
	IRIDESCENT_FOLD_SPEED,
	type IridescentFoldPosition,
	type IridescentFoldSpeed,
	type IridescentFoldTone,
	type IridescentFoldVariant,
	iridescentFold,
} from "./variants";

export type {
	IridescentFoldPosition,
	IridescentFoldSpeed,
	IridescentFoldTone,
	IridescentFoldVariant,
};

export interface IridescentFoldProps {
	variant?: IridescentFoldVariant;
	tone?: IridescentFoldTone;
	speed?: IridescentFoldSpeed;
	position?: IridescentFoldPosition;
	/** Effect strength, 0 to 2. */
	intensity?: number;
	/** Film grain, 0 to 1. */
	grain?: number;
	className?: string;
	children?: ReactNode;
}

/** Holographic foil or satin with a thin-film sheen and specular streaks, drawn in WebGL. */
export function IridescentFold({
	variant = "foil",
	tone = "holo",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	grain = 0,
	className,
	children,
}: IridescentFoldProps) {
	const options: IridescentFoldOptions = {
		colors: IRIDESCENT_FOLD_COLORS[tone],
		speed: IRIDESCENT_FOLD_SPEED[speed],
		intensity,
		grain,
		silk: variant === "silk",
	};
	const { root, canvas, webgl } = useCanvasEngine(mountIridescentFold, options, [
		variant,
		tone,
		speed,
		intensity,
		grain,
	]);
	const s = iridescentFold({ variant, tone, speed, position, webgl });

	return (
		<div ref={root} data-slot="iridescent-fold" className={cn(s.root(), className)}>
			<div aria-hidden className={s.fallback()} />
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
