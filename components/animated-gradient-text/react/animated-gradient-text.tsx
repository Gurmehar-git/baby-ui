import {
	type CSSProperties,
	createElement,
	type ElementType,
	type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { type GradientTextTone, gradientText } from "../variants";

export type { GradientTextTone };

export interface AnimatedGradientTextProps {
	children: ReactNode;
	/** Tag to render; text effects are typography, not their own element. */
	as?: ElementType;
	tone?: GradientTextTone;
	/** One full sweep cycle, in seconds. */
	durationSeconds?: number;
	className?: string;
}

export function AnimatedGradientText({
	children,
	as = "span",
	tone = "primary",
	durationSeconds = 3,
	className,
}: AnimatedGradientTextProps) {
	return createElement(
		as,
		{
			"data-slot": "animated-gradient-text",
			className: cn(gradientText({ tone }), className),
			style: { "--agt-duration": `${durationSeconds}s` } as CSSProperties,
		},
		children,
	);
}
