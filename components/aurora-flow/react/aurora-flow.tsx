"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { type CanvasEngine, useCanvasEngine } from "../../lib/react/use-canvas-engine";
import { type AuroraFlowOptions, mountAuroraFlow } from "../aurora";
import { mountSilkAurora } from "../silk";
import {
	AURORA_FLOW_GRAIN,
	AURORA_FLOW_SPEED,
	type AuroraFlowPosition,
	type AuroraFlowSpeed,
	type AuroraFlowTone,
	type AuroraFlowVariant,
	auroraColors,
	auroraFlow,
} from "../variants";

export type { AuroraFlowPosition, AuroraFlowSpeed, AuroraFlowTone, AuroraFlowVariant };

export interface AuroraFlowProps {
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
	className?: string;
	children?: ReactNode;
}

/** Silk light drifting in a WebGL field, as layered veils or three sheened ribbons, from theme tokens. */
export function AuroraFlow({ variant = "veil", ...props }: AuroraFlowProps) {
	// Each variant is its own shader, so a switch remounts the canvas.
	return <AuroraField key={variant} variant={variant} {...props} />;
}

function AuroraField({
	variant,
	tone = "chart",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	grain,
	direction = -18,
	interactive = true,
	className,
	children,
}: AuroraFlowProps & { variant: AuroraFlowVariant }) {
	const mount: CanvasEngine<AuroraFlowOptions> =
		variant === "silk" ? mountSilkAurora : mountAuroraFlow;
	const options: AuroraFlowOptions = {
		colors: auroraColors(variant, tone),
		speed: AURORA_FLOW_SPEED[speed],
		intensity,
		grain: grain ?? AURORA_FLOW_GRAIN[variant],
		direction,
		interactive,
	};
	const { root, canvas, webgl } = useCanvasEngine(mount, options, [
		tone,
		speed,
		intensity,
		grain,
		direction,
		interactive,
	]);
	const s = auroraFlow({ variant, tone, speed, position, webgl });

	return (
		<div
			ref={root}
			data-slot="aurora-flow"
			data-variant={variant}
			className={cn(s.root(), className)}
		>
			<div aria-hidden className={s.fallback()} />
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
