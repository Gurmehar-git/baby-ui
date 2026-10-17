import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/cn";
import {
	type AnimatedGradientPosition,
	type AnimatedGradientTone,
	animatedGradient,
} from "../variants";

export type { AnimatedGradientPosition, AnimatedGradientTone };

export interface AnimatedGradientProps {
	tone?: AnimatedGradientTone;
	/** `absolute` fills the nearest positioned parent; `fixed` fills the viewport. */
	position?: AnimatedGradientPosition;
	/** Seconds for one drift cycle. */
	duration?: number;
	/** Rendered above the gradient. */
	children?: ReactNode;
	className?: string;
}

/** A full-bleed background of soft token-coloured blobs drifting on a CSS-only loop. */
export function AnimatedGradient({
	tone,
	position,
	duration = 20,
	children,
	className,
}: AnimatedGradientProps) {
	const s = animatedGradient({ tone, position });
	const style = { "--animated-gradient-duration": `${duration}s` } as CSSProperties;
	return (
		<div data-slot="animated-gradient" className={cn(s.root(), className)} style={style}>
			<div aria-hidden className={s.layer()} />
			<div aria-hidden className={s.layerAlt()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
