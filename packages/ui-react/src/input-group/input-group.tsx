"use client";

import type { ComponentProps } from "react";
import { Button, type ButtonProps } from "../button/button";
import type { ButtonSize } from "../button/variants";
import { Input } from "../input/input";
import { cn } from "../lib/cn";
import { Textarea } from "../textarea/textarea";
import {
	focusGroupControl,
	type InputGroupAddonAlign,
	type InputGroupSize,
	inputGroup,
	inputGroupAddon,
} from "./variants";

export type { InputGroupAddonAlign, InputGroupSize };

const s = inputGroup();

export function InputGroup({
	className,
	size = "default",
	...props
}: ComponentProps<"div"> & { size?: InputGroupSize }) {
	return (
		// biome-ignore lint/a11y/useSemanticElements: shadcn's markup; a fieldset would add a border and legend semantics
		<div
			role="group"
			data-slot="input-group"
			className={cn(inputGroup({ size }).root(), className)}
			{...props}
		/>
	);
}

export function InputGroupAddon({
	className,
	align = "inline-start",
	onClick,
	...props
}: ComponentProps<"div"> & { align?: InputGroupAddonAlign }) {
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: a pointer convenience; the control is focusable itself
		// biome-ignore lint/a11y/useSemanticElements: shadcn's markup; a fieldset would add a border and legend semantics
		<div
			role="group"
			data-slot="input-group-addon"
			data-align={align}
			className={cn(inputGroupAddon({ align }), className)}
			onClick={(event) => {
				focusGroupControl(event.target, event.currentTarget);
				onClick?.(event);
			}}
			{...props}
		/>
	);
}

export function InputGroupButton({
	className,
	type = "button",
	variant = "ghost",
	size = "xs",
	...props
}: Omit<Extract<ButtonProps, { href?: undefined }>, "size"> & {
	size?: Extract<ButtonSize, "xs" | "sm" | "icon-xs" | "icon-sm">;
}) {
	return (
		<Button
			type={type}
			data-size={size}
			variant={variant}
			size={size}
			className={cn(s.button(), className)}
			{...props}
		/>
	);
}

export function InputGroupText({ className, ...props }: ComponentProps<"span">) {
	return <span className={cn(s.text(), className)} {...props} />;
}

export function InputGroupInput({ className, ...props }: ComponentProps<typeof Input>) {
	return (
		<Input
			data-slot="input-group-control"
			className={cn(s.control(), className)}
			{...props}
		/>
	);
}

export function InputGroupTextarea({
	className,
	...props
}: ComponentProps<typeof Textarea>) {
	return (
		<Textarea
			data-slot="input-group-control"
			className={cn(s.control(), s.textarea(), className)}
			{...props}
		/>
	);
}
