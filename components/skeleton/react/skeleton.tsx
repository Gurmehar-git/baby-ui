import type { ComponentProps } from "react";
import { cn } from "../../lib/react/cn";
import { type SkeletonShape, skeleton, skeletonReveal } from "./variants";

export interface SkeletonProps extends ComponentProps<"div"> {
	/** Overrides the class width; omit to size with classes. */
	width?: string;
	height?: string;
	shape?: SkeletonShape;
	/** With children: shows the placeholder in their shape, then crossfades to them once false. */
	loading?: boolean;
}

export function Skeleton({
	width,
	height,
	shape = "line",
	loading,
	className,
	style,
	children,
	...props
}: SkeletonProps) {
	if (children !== undefined) {
		const r = skeletonReveal();
		const busy = loading ?? true;
		return (
			<div
				data-slot="skeleton-reveal"
				aria-busy={busy || undefined}
				className={cn(r.root(), className)}
				{...props}
			>
				<div
					aria-hidden
					data-slot="skeleton"
					data-loading={busy}
					style={{ width, height, ...style }}
					className={cn(skeleton({ shape }), r.placeholder())}
				/>
				<div data-loading={busy} inert={busy} className={r.content()}>
					{children}
				</div>
			</div>
		);
	}
	return (
		<div
			aria-hidden
			data-slot="skeleton"
			{...props}
			style={{ width, height, ...style }}
			className={cn(skeleton({ shape }), className)}
		/>
	);
}
