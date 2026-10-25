"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { ANCHORED } from "../../lib/react/anchor";
import { type PopoverSize, popover } from "../variants";

export type { PopoverSize };

export const Popover = PopoverPrimitive.Root;

export function PopoverTrigger({
	className,
	...props
}: ComponentProps<typeof PopoverPrimitive.Trigger>) {
	return (
		<PopoverPrimitive.Trigger
			data-slot="popover-trigger"
			className={cn(
				"inline-flex rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
				className,
			)}
			{...props}
		/>
	);
}

export function PopoverContent({
	className,
	align = "center",
	alignOffset = 0,
	side = "bottom",
	sideOffset = 4,
	anchor,
	container,
	size = "default",
	...props
}: ComponentProps<typeof PopoverPrimitive.Popup> &
	Pick<
		ComponentProps<typeof PopoverPrimitive.Positioner>,
		"align" | "alignOffset" | "side" | "sideOffset" | "anchor"
	> &
	Pick<ComponentProps<typeof PopoverPrimitive.Portal>, "container"> & {
		size?: PopoverSize;
	}) {
	const styles = popover({ size });
	return (
		<PopoverPrimitive.Portal container={container}>
			<PopoverPrimitive.Positioner
				anchor={anchor}
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
				className="isolate z-50"
			>
				<PopoverPrimitive.Popup
					data-slot="popover-content"
					data-size={size}
					className={cn(
						ANCHORED,
						"static",
						styles.surface(),
						styles.content(),
						className,
					)}
					{...props}
				/>
			</PopoverPrimitive.Positioner>
		</PopoverPrimitive.Portal>
	);
}
