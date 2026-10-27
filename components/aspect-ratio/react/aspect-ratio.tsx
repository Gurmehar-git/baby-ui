import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { type AspectRatioFit, type AspectRatioMotion, aspectRatio } from "../variants";

export type { AspectRatioFit, AspectRatioMotion };

export interface AspectRatioProps extends Omit<ComponentProps<"div">, "children"> {
	children?: ReactNode;
	ratio?: number;
	motion?: AspectRatioMotion;
	contentClassName?: string;
}

export function AspectRatio({
	children,
	ratio = 1,
	motion = "smooth",
	className,
	contentClassName,
	style,
	...props
}: AspectRatioProps) {
	if (!Number.isFinite(ratio) || ratio <= 0)
		throw new RangeError("AspectRatio: ratio must be a finite, positive number.");
	const styles = aspectRatio({ motion });
	return (
		<div
			data-slot="aspect-ratio"
			data-motion={motion}
			className={cn(styles.root(), className)}
			style={{ ...style, aspectRatio: ratio } as CSSProperties}
			{...props}
		>
			<div
				data-slot="aspect-ratio-content"
				className={cn(styles.content(), contentClassName)}
			>
				{children}
			</div>
		</div>
	);
}

export interface AspectRatioImageProps
	extends Omit<ComponentProps<"img">, "alt" | "width" | "height"> {
	alt: string;
	width: number;
	height: number;
	fit?: AspectRatioFit;
}

export function AspectRatioImage({
	alt,
	width,
	height,
	fit = "cover",
	className,
	draggable = false,
	...props
}: AspectRatioImageProps) {
	if (![width, height].every((value) => Number.isFinite(value) && value > 0))
		throw new RangeError(
			"AspectRatioImage: width and height must be finite, positive numbers.",
		);
	return (
		<img
			{...props}
			data-slot="aspect-ratio-image"
			alt={alt}
			width={width}
			height={height}
			draggable={draggable}
			className={cn(aspectRatio({ fit }).image(), className)}
		/>
	);
}
