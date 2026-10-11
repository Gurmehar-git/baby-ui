"use client";

import type { ComponentProps } from "react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../command/command";
import { cn } from "../lib/cn";
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover";
import { type ComboboxSize, combobox } from "./variants";

/** A combobox is a Popover whose content is a Command: shadcn/ui's own combobox recipe,
 * no dedicated positioning, dismiss or search logic of its own. */
export const Combobox = Popover;

export function ComboboxTrigger({
	className,
	size = "default",
	...props
}: ComponentProps<typeof PopoverTrigger> & { size?: ComboboxSize }) {
	return (
		<PopoverTrigger
			role="combobox"
			className={cn(combobox({ size }).trigger(), className)}
			{...props}
		/>
	);
}

export function ComboboxContent({
	className,
	children,
	size = "default",
	...props
}: ComponentProps<typeof PopoverContent> & { size?: ComboboxSize }) {
	const c = combobox({ size });
	return (
		<PopoverContent className={cn(c.content(), className)} {...props}>
			<Command className={c.list()}>{children}</Command>
		</PopoverContent>
	);
}

export {
	CommandEmpty as ComboboxEmpty,
	CommandGroup as ComboboxGroup,
	CommandInput as ComboboxInput,
	CommandItem as ComboboxItem,
	CommandList as ComboboxList,
};
