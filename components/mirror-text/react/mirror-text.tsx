import { createElement, type ElementType, Fragment } from "react";
import { cn } from "../../lib/cn";
import { type MirrorTextDirection, mirrorText } from "../variants";

export type { MirrorTextDirection };

export interface MirrorTextProps {
	/** Shown as four stacked, clipped copies that stagger apart on hover. */
	text: string;
	as?: ElementType;
	direction?: MirrorTextDirection;
	/** How long each layer's slide takes, in ms. */
	durationMs?: number;
	/** Delay step between the four stacked layers, in ms. */
	staggerMs?: number;
	className?: string;
}

const LAYER_COUNT = 4;

export function MirrorText({
	text,
	as = "span",
	direction = "up",
	durationMs = 500,
	staggerMs = 67,
	className,
}: MirrorTextProps) {
	const { root, layer } = mirrorText({ direction });
	return createElement(
		as,
		{ "data-slot": "mirror-text", className: cn(root(), className) },
		<Fragment>
			<span className="sr-only">{text}</span>
			{Array.from({ length: LAYER_COUNT }, (_, index) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: generated from a count, so position is the identity.
					key={index}
					aria-hidden
					className={cn("h-[0.6em] overflow-hidden", layer())}
					style={{
						transitionDuration: `${durationMs}ms`,
						transitionDelay: `${(LAYER_COUNT - 1 - index) * staggerMs}ms`,
					}}
				>
					<div className="inline-block leading-none">{text}</div>
				</div>
			))}
		</Fragment>,
	);
}
