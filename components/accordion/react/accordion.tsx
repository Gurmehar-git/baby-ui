"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { type AccordionMotion, accordion } from "../variants";

export type { AccordionMotion };

type AccordionType = "single" | "multiple";

export type AccordionProps = Omit<
	ComponentProps<typeof AccordionPrimitive.Root>,
	"value" | "defaultValue" | "onValueChange" | "multiple"
> & {
	type?: AccordionType;
	/** Ignored: Base UI's single mode always allows closing the open item. Kept so
	 * existing callers passing `collapsible={false}` still compile. */
	collapsible?: boolean;
	/** The open item in single mode, the open items in multiple mode. */
	value?: string | string[];
	defaultValue?: string | string[];
	onValueChange?: (value: string | string[]) => void;
	motion?: AccordionMotion;
};

const toList = (v: string | string[] | undefined) =>
	v === undefined ? undefined : Array.isArray(v) ? v : [v];

export function Accordion({
	type = "single",
	collapsible: _collapsible,
	value,
	defaultValue,
	onValueChange,
	motion = "smooth",
	className,
	...props
}: AccordionProps) {
	return (
		<AccordionPrimitive.Root
			data-slot="accordion"
			data-motion={motion}
			multiple={type === "multiple"}
			value={toList(value)}
			defaultValue={toList(defaultValue)}
			onValueChange={(next: string[]) =>
				onValueChange?.(type === "multiple" ? next : (next[0] ?? ""))
			}
			keepMounted
			className={cn(accordion({ motion }), className)}
			{...props}
		/>
	);
}

export function AccordionItem({
	className,
	...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
	return (
		<AccordionPrimitive.Item
			data-slot="accordion-item"
			className={cn(className)}
			{...props}
		/>
	);
}

export function AccordionTrigger({
	className,
	children,
	...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) {
	return (
		<AccordionPrimitive.Header data-slot="accordion-header" className="flex">
			<AccordionPrimitive.Trigger
				data-slot="accordion-trigger"
				className={cn(
					"group/accordion-trigger flex flex-1 items-center justify-between gap-4 px-4 py-3 text-left font-medium text-foreground text-sm outline-none transition-colors hover:bg-foreground/[0.03] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50",
					className,
				)}
				{...props}
			>
				{children}
				{/* Only the chevron turns; a leading icon passed as children stays put. */}
				<svg
					viewBox="0 0 16 16"
					fill="none"
					aria-hidden
					data-slot="accordion-icon"
					className="size-4 shrink-0 text-muted-foreground transition-[rotate] duration-(--accordion-duration) ease-(--accordion-ease) group-data-[panel-open]/accordion-trigger:rotate-180 group-data-[panel-open]/accordion-trigger:duration-(--accordion-open-duration) group-data-[panel-open]/accordion-trigger:ease-(--accordion-open-ease) motion-reduce:transition-none"
				>
					<path
						d="m4 6 4 4 4-4"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
}

export function AccordionContent({
	className,
	children,
	...props
}: ComponentProps<typeof AccordionPrimitive.Panel>) {
	return (
		<AccordionPrimitive.Panel
			data-slot="accordion-content"
			className="group/accordion-panel grid grid-rows-[0fr] transition-[grid-template-rows] duration-(--accordion-duration) ease-(--accordion-ease) data-[open]:grid-rows-[1fr] data-[open]:[--accordion-duration:var(--accordion-open-duration)] data-[open]:[--accordion-ease:var(--accordion-open-ease)] motion-reduce:transition-none"
			render={(renderProps, state) => <div {...renderProps} inert={!state.open} />}
			{...props}
		>
			<div className="overflow-hidden">
				<div
					className={cn(
						// The answer settles into place as the panel opens, and lifts back as it closes.
						"px-4 pb-3 text-muted-foreground text-sm leading-relaxed translate-y-(--accordion-content-y) scale-y-(--accordion-content-scale) opacity-0 transition-[translate,scale,opacity] duration-(--accordion-duration) ease-(--accordion-ease) origin-top group-data-[open]/accordion-panel:translate-y-0 group-data-[open]/accordion-panel:scale-y-100 group-data-[open]/accordion-panel:opacity-100 motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:scale-y-100",
						className,
					)}
				>
					{children}
				</div>
			</div>
		</AccordionPrimitive.Panel>
	);
}
