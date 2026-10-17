import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import {
	NOTCHED_SHELF_PATHS,
	type NotchedShelfAlign,
	type NotchedShelfLayout,
	type NotchedShelfShape,
	type NotchedShelfSize,
	type NotchedShelfVariant,
	notchedShelf,
} from "../variants";

export type {
	NotchedShelfAlign,
	NotchedShelfLayout,
	NotchedShelfShape,
	NotchedShelfSize,
	NotchedShelfVariant,
};

export interface NotchedShelfProps extends ComponentProps<"div"> {
	variant?: NotchedShelfVariant;
	layout?: NotchedShelfLayout;
	size?: NotchedShelfSize;
	shape?: NotchedShelfShape;
	align?: NotchedShelfAlign;
	/** Continue the hairline along the rest of the edge, full width. */
	edge?: boolean;
	/** Text colour class overriding the variant's fill, e.g. `text-card` over a card surface. */
	fill?: string;
	/** Stroke colour class overriding the variant's hairline. */
	stroke?: string;
}

export function NotchedShelf({
	children,
	variant = "solid",
	layout = "hanging",
	size = "default",
	shape = "smooth",
	align = "center",
	edge = false,
	fill,
	stroke,
	className,
	...props
}: NotchedShelfProps) {
	const styles = notchedShelf({ variant, layout, size, align, edge });
	const paths = NOTCHED_SHELF_PATHS[shape];

	const wing = (mirrored: boolean) => (
		<svg
			viewBox="0 0 85 64"
			fill="none"
			aria-hidden
			data-slot="notched-shelf-wing"
			className={styles.wing({ mirrored })}
		>
			<rect
				x="0"
				y="0"
				width="85"
				height="1"
				fill="currentColor"
				transform="translate(0, -1)"
			/>
			<path d={paths.fill} fill="currentColor" />
			<path
				d={paths.edge}
				fill="none"
				className={cn(styles.stroke(), stroke)}
				strokeWidth="1"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	);

	return (
		<div
			data-slot="notched-shelf"
			data-variant={variant}
			data-layout={layout}
			data-shape={shape}
			className={cn(styles.root(), fill, className)}
			{...props}
		>
			{edge ? <span aria-hidden className={styles.edge()} /> : null}
			{wing(false)}
			{/* bg-current takes the fill; the colour reset sits one level in so it can't repaint the bar. */}
			<div className={styles.bar()}>
				<div className={styles.content()}>{children}</div>
			</div>
			{wing(true)}
			{edge ? <span aria-hidden className={styles.edge()} /> : null}
		</div>
	);
}
