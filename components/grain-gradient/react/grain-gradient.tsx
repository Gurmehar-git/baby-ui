import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/react/cn";
import {
	type GrainGradientPosition,
	type GrainGradientTone,
	grainGradient,
	grainTexture,
} from "./variants";

export type { GrainGradientPosition, GrainGradientTone };

export interface GrainGradientProps {
	tone?: GrainGradientTone;
	/** `absolute` fills the nearest positioned parent; `fixed` fills the viewport. */
	position?: GrainGradientPosition;
	/** Composition rotation in degrees. */
	angle?: number;
	/** Grain strength, 0 to 1. */
	grain?: number;
	/** Grain coarseness, 0.5 to 4. */
	grainSize?: number;
	/** Seconds for one breath. */
	duration?: number;
	/** Rendered above the gradient. */
	children?: ReactNode;
	className?: string;
}

/** A full-bleed glow and diffused shadow edge that breathe slowly under a static film grain. */
export function GrainGradient({
	tone,
	position,
	angle = 0,
	grain = 0.35,
	grainSize = 1,
	duration = 12,
	children,
	className,
}: GrainGradientProps) {
	const s = grainGradient({ tone, position });
	const style = {
		"--grain-gradient-angle": `${angle}deg`,
		"--grain-gradient-duration": `${duration}s`,
	} as CSSProperties;
	return (
		<div data-slot="grain-gradient" className={cn(s.root(), className)} style={style}>
			<div aria-hidden className={s.scene()}>
				<div className={s.glow()} />
				<div className={s.shadow()} />
			</div>
			<div
				aria-hidden
				className={s.grain()}
				style={{ opacity: grain, backgroundImage: grainTexture(grainSize) }}
			/>
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
