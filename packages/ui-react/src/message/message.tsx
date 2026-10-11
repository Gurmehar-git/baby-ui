"use client";

import type { ComponentProps } from "react";
import { cn } from "../lib/cn";
import {
	type MessageAlign,
	type MessageBubbleVariant,
	type MessageMotion,
	message,
	messageBubble,
} from "./variants";

export type { MessageAlign, MessageBubbleVariant, MessageMotion };

export type MessageGroupProps = ComponentProps<"div">;

/** Groups several messages from one sender. `overflow-x-clip` (not `hidden`) swallows a
 * row's sideways entrance travel without creating a scroll container. */
export function MessageGroup({ className, ...props }: MessageGroupProps) {
	return (
		<div
			data-slot="message-group"
			className={cn("flex min-w-0 flex-col gap-2 overflow-x-clip", className)}
			{...props}
		/>
	);
}

export interface MessageProps extends ComponentProps<"article"> {
	/** Which side the message belongs to. `end` reads as sent (row reversed, entrance from
	 * the right); `start` reads as received (entrance from the left). */
	align?: MessageAlign;
	/** Play the entrance. Set false for history already on screen, so only newly arriving
	 * messages animate. */
	animated?: boolean;
	motion?: MessageMotion;
}

export function Message({
	align = "start",
	animated = true,
	motion = "spring",
	className,
	...props
}: MessageProps) {
	const enter = animated && motion !== "none";
	const entranceClass = enter
		? motion === "fade"
			? "fade-in"
			: align === "end"
				? "message-spring-end"
				: "message-spring-start"
		: undefined;

	return (
		<article
			data-slot="message"
			data-align={align}
			className={cn(message({ align, motion }), entranceClass, className)}
			{...props}
		/>
	);
}

/** A styled slot, not an image component: pass your own `<img>`/`<AvatarFallback>`/icon
 * as children. Lifts clear of a footer line when one is present in the same message. */
export function MessageAvatar({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="message-avatar"
			className={cn(
				"flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted transition-transform duration-(--duration-slow) ease-[var(--ease-ui-out)] group-has-data-[slot=message-footer]/message:-translate-y-8 motion-reduce:transition-none",
				className,
			)}
			{...props}
		/>
	);
}

export function MessageContent({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="message-content"
			className={cn(
				"flex w-full min-w-0 flex-col gap-2 wrap-break-word group-data-[align=end]/message:*:data-[slot]:self-end",
				className,
			)}
			{...props}
		/>
	);
}

export interface MessageBubbleProps extends ComponentProps<"div"> {
	/** `default` is a muted pill for received messages, `primary` a filled pill for sent
	 * ones, `ghost` drops the pill for bare text like a streamed reply. */
	variant?: MessageBubbleVariant;
}

export function MessageBubble({
	className,
	variant = "default",
	...props
}: MessageBubbleProps) {
	return (
		<div
			data-slot="message-bubble"
			data-variant={variant}
			className={cn(messageBubble({ variant }), className)}
			{...props}
		/>
	);
}

export function MessageHeader({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="message-header"
			className={cn(
				"flex min-w-0 max-w-full items-center px-3 font-medium text-muted-foreground text-xs group-has-data-[variant=ghost]/message:px-0",
				className,
			)}
			{...props}
		/>
	);
}

export function MessageFooter({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="message-footer"
			className={cn(
				"flex min-w-0 max-w-full items-center px-3 font-medium text-muted-foreground text-xs group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

/** A three-dot "thinking" indicator, styled to sit inside a `MessageBubble`. */
export function MessageTyping({ className, ...props }: ComponentProps<"span">) {
	return (
		<span
			role="status"
			data-slot="message-typing"
			className={cn("flex items-center gap-1 py-1", className)}
			{...props}
		>
			<span className="sr-only">Thinking</span>
			{[0, 1, 2].map((dot) => (
				<span
					key={dot}
					style={{ animationDelay: `${dot * 160}ms` }}
					className="typing-dot size-1.5 rounded-full bg-current opacity-40"
				/>
			))}
		</span>
	);
}
