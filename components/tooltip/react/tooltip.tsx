"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import {
	type ComponentProps,
	createContext,
	isValidElement,
	type ReactNode,
	useContext,
} from "react";
import { cn } from "../../lib/cn";
import { ANCHORED } from "../../lib/react/anchor";

export function TooltipProvider(props: ComponentProps<typeof TooltipPrimitive.Provider>) {
	return <TooltipPrimitive.Provider {...props} />;
}

const DelayCtx = createContext(400);

export function Tooltip({
	children,
	delay = 400,
	...props
}: ComponentProps<typeof TooltipPrimitive.Root> & {
	children?: ReactNode;
	delay?: number;
}) {
	return (
		<DelayCtx.Provider value={delay}>
			<TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>
		</DelayCtx.Provider>
	);
}

export function TooltipTrigger({
	className,
	render,
	...props
}: ComponentProps<typeof TooltipPrimitive.Trigger>) {
	const delay = useContext(DelayCtx);
	// Base UI joins a render element's class after ours without merging, so `grid` lost to `inline-flex`.
	const rendered = isValidElement<{ className?: string }>(render)
		? render.props.className
		: undefined;

	return (
		<TooltipPrimitive.Trigger
			data-slot="tooltip-trigger"
			delay={delay}
			render={render}
			className={cn("inline-flex", className, rendered)}
			{...props}
		/>
	);
}

export function TooltipContent({
	className,
	align = "center",
	alignOffset = 0,
	side = "top",
	sideOffset = 6,
	...props
}: ComponentProps<typeof TooltipPrimitive.Popup> &
	Pick<
		ComponentProps<typeof TooltipPrimitive.Positioner>,
		"align" | "alignOffset" | "side" | "sideOffset"
	>) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Positioner
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
				className="isolate z-50"
			>
				<TooltipPrimitive.Popup
					data-slot="tooltip-content"
					className={cn(
						ANCHORED,
						"static z-50 rounded-md bg-foreground px-2 py-1 text-background text-xs shadow-(--overlay-shadow)",
						"data-[open]:pointer-events-none",
						className,
					)}
					{...props}
				/>
			</TooltipPrimitive.Positioner>
		</TooltipPrimitive.Portal>
	);
}
