import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { type BentoSpan, bentoCell } from "../variants";

export type { BentoSpan };

export interface BentoGridProps {
	children: ReactNode;
	className?: string;
	columns?: number;
	gap?: number;
	rowHeight?: number;
}

export function BentoGrid({
	children,
	className,
	columns = 3,
	gap = 16,
	rowHeight = 160,
}: BentoGridProps) {
	const style = {
		"--bento-columns": String(columns),
		gap: `${gap}px`,
		gridAutoRows: `${rowHeight}px`,
	} as CSSProperties;

	return (
		<div
			data-slot="bento-grid"
			style={style}
			className={cn(
				"grid grid-cols-1 md:grid-cols-[repeat(var(--bento-columns),minmax(0,1fr))]",
				className,
			)}
		>
			{children}
		</div>
	);
}

export interface BentoCellProps {
	children?: ReactNode;
	className?: string;
	span?: BentoSpan;
	title?: string;
	description?: string;
}

export function BentoCell({
	children,
	className,
	span = "1x1",
	title,
	description,
}: BentoCellProps) {
	return (
		<div
			data-slot="bento-cell"
			data-span={span}
			className={cn(bentoCell({ span }), className)}
		>
			{title ? (
				<h3 data-slot="bento-cell-title" className="font-medium text-foreground text-sm">
					{title}
				</h3>
			) : null}
			{description ? (
				<p
					data-slot="bento-cell-description"
					className="mt-1 text-muted-foreground text-xs leading-relaxed"
				>
					{description}
				</p>
			) : null}
			<div data-slot="bento-cell-content" className="min-h-0 flex-1">
				{children}
			</div>
		</div>
	);
}
