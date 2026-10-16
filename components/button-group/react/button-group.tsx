"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type { ComponentProps } from "react";
import { cn } from "../../lib/react/cn";
import { Separator } from "../../separator/react/separator";
import { type ButtonGroupOrientation, buttonGroup } from "./variants";

export type { ButtonGroupOrientation };

export function ButtonGroup({
	className,
	orientation = "horizontal",
	...props
}: ComponentProps<"div"> & { orientation?: ButtonGroupOrientation }) {
	return (
		// biome-ignore lint/a11y/useSemanticElements: shadcn's markup; a fieldset would add a border and legend semantics
		<div
			role="group"
			data-slot="button-group"
			data-orientation={orientation}
			className={cn(buttonGroup({ orientation }).root(), className)}
			{...props}
		/>
	);
}

export function ButtonGroupText({
	className,
	render,
	...props
}: useRender.ComponentProps<"div">) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">({ className: cn(buttonGroup().text(), className) }, props),
		render,
		state: { slot: "button-group-text" },
	});
}

export function ButtonGroupSeparator({
	className,
	orientation = "vertical",
	...props
}: ComponentProps<typeof Separator>) {
	return (
		<Separator
			data-slot="button-group-separator"
			orientation={orientation}
			className={cn(buttonGroup().separator(), className)}
			{...props}
		/>
	);
}
