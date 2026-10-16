"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import type { ComponentProps } from "react";
import { cn } from "../../lib/react/cn";
import { type AvatarShape, type AvatarSize, avatar, avatarGroup } from "./variants";

export type { AvatarShape, AvatarSize };

export function Avatar({
	className,
	size = "default",
	shape = "circle",
	...props
}: ComponentProps<typeof AvatarPrimitive.Root> & {
	size?: AvatarSize;
	shape?: AvatarShape;
}) {
	return (
		<AvatarPrimitive.Root
			data-slot="avatar"
			data-size={size}
			className={cn(avatar({ size, shape }), className)}
			{...props}
		/>
	);
}

export function AvatarImage({
	className,
	src,
	...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
	if (!src) return null;

	return (
		<AvatarPrimitive.Image
			data-slot="avatar-image"
			src={src}
			// keepMounted keeps our own opacity fade (Base UI's default mode skips straight
			// to mounted-when-loaded, with no fade of its own to preserve).
			keepMounted
			className={cn(
				"absolute inset-0 size-full rounded-[inherit] object-cover opacity-100 transition-opacity duration-(--duration-base) ease-[var(--ease-ui-out)] data-[loading]:opacity-0 data-[error]:hidden motion-reduce:transition-none",
				className,
			)}
			{...props}
		/>
	);
}

export function AvatarFallback({
	className,
	...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cn("font-medium text-muted-foreground select-none", className)}
			{...props}
		/>
	);
}

/** A status dot or icon pinned to the avatar's corner. */
export function AvatarBadge({ className, ...props }: ComponentProps<"span">) {
	return (
		<span
			data-slot="avatar-badge"
			className={cn(avatarGroup().badge(), className)}
			{...props}
		/>
	);
}

/** Overlapping avatars; members lift on hover and pop in as they join. */
export function AvatarGroup({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="avatar-group"
			className={cn(avatarGroup().root(), className)}
			{...props}
		/>
	);
}

/** The "+3" chip at the end of a group, sized like an avatar. */
export function AvatarGroupCount({
	className,
	size = "default",
	shape = "circle",
	...props
}: ComponentProps<"div"> & { size?: AvatarSize; shape?: AvatarShape }) {
	return (
		<div
			data-slot="avatar-group-count"
			className={cn(avatar({ size, shape }), avatarGroup().count(), className)}
			{...props}
		/>
	);
}
