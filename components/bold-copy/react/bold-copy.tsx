import type { CSSProperties } from "react";
import { cn } from "../../lib/cn";
import { type BoldCopySize, boldCopy } from "../variants";

export type { BoldCopySize };

export interface BoldCopyProps {
	/** The word or short phrase shown, doubled: a faint background copy, a sharp copy on top. */
	text: string;
	size?: BoldCopySize;
	/** How long the hover fill/scale takes, in ms. */
	durationMs?: number;
	className?: string;
}

export function BoldCopy({
	text,
	size = "xl",
	durationMs = 300,
	className,
}: BoldCopyProps) {
	const { root, background, title } = boldCopy({ size });
	return (
		<div
			data-slot="bold-copy"
			className={cn(root(), className)}
			style={{ "--bc-duration": `${durationMs}ms` } as CSSProperties}
		>
			<div className={background()}>{text}</div>
			<div className={title()}>{text}</div>
		</div>
	);
}
