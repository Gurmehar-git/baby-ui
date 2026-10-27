"use client";

import { type ComponentProps, createContext, type PointerEvent, useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar/react/avatar";
import { cn } from "../../lib/cn";
import { type TestimonialVariant, testimonial } from "../variants";

export type { TestimonialVariant };

const TestimonialContext = createContext<TestimonialVariant>("card");

export function Testimonial({
	variant = "card",
	className,
	onPointerMove,
	children,
	...props
}: ComponentProps<"figure"> & { variant?: TestimonialVariant }) {
	const s = testimonial({ variant });
	const move = (event: PointerEvent<HTMLElement>) => {
		onPointerMove?.(event);
		if (variant !== "spotlight" || event.defaultPrevented) return;
		const rect = event.currentTarget.getBoundingClientRect();
		event.currentTarget.style.setProperty(
			"--testimonial-x",
			`${event.clientX - rect.left}px`,
		);
		event.currentTarget.style.setProperty(
			"--testimonial-y",
			`${event.clientY - rect.top}px`,
		);
	};
	return (
		<TestimonialContext.Provider value={variant}>
			<figure
				data-slot="testimonial"
				data-variant={variant}
				className={cn(s.root(), className)}
				onPointerMove={move}
				{...props}
			>
				{variant === "spotlight" ? (
					<span
						aria-hidden
						className={s.spotlight()}
						style={{
							background:
								"radial-gradient(circle at var(--testimonial-x, 50%) var(--testimonial-y, 50%), color-mix(in oklab, var(--foreground) 14%, transparent), transparent 60%)",
						}}
					/>
				) : null}
				{children}
			</figure>
		</TestimonialContext.Provider>
	);
}

export function TestimonialQuote({ className, ...props }: ComponentProps<"blockquote">) {
	const variant = useContext(TestimonialContext);
	return (
		<blockquote
			data-slot="testimonial-quote"
			className={cn(testimonial({ variant }).quote(), className)}
			{...props}
		/>
	);
}

export function TestimonialAuthor({ className, ...props }: ComponentProps<"figcaption">) {
	const variant = useContext(TestimonialContext);
	return (
		<figcaption
			data-slot="testimonial-author"
			className={cn(testimonial({ variant }).author(), className)}
			{...props}
		/>
	);
}

export function TestimonialAvatar({
	className,
	...props
}: ComponentProps<typeof Avatar>) {
	const variant = useContext(TestimonialContext);
	return (
		<Avatar
			data-slot="testimonial-avatar"
			size="sm"
			className={cn(testimonial({ variant }).avatar(), className)}
			{...props}
		/>
	);
}

export function TestimonialAvatarImage(props: ComponentProps<typeof AvatarImage>) {
	return <AvatarImage data-slot="testimonial-avatar-image" {...props} />;
}

export function TestimonialAvatarFallback(props: ComponentProps<typeof AvatarFallback>) {
	return <AvatarFallback data-slot="testimonial-avatar-fallback" {...props} />;
}

export function TestimonialAuthorDetails({
	className,
	...props
}: ComponentProps<"span">) {
	const variant = useContext(TestimonialContext);
	return (
		<span
			data-slot="testimonial-author-details"
			className={cn(testimonial({ variant }).details(), className)}
			{...props}
		/>
	);
}

export function TestimonialAuthorName({ className, ...props }: ComponentProps<"span">) {
	const variant = useContext(TestimonialContext);
	return (
		<span
			data-slot="testimonial-author-name"
			className={cn(testimonial({ variant }).name(), className)}
			{...props}
		/>
	);
}

export function TestimonialAuthorTagline({
	className,
	...props
}: ComponentProps<"span">) {
	const variant = useContext(TestimonialContext);
	return (
		<span
			data-slot="testimonial-author-tagline"
			className={cn(testimonial({ variant }).tagline(), className)}
			{...props}
		/>
	);
}

export function TestimonialVerifiedBadge({
	className,
	children,
	...props
}: ComponentProps<"span">) {
	const variant = useContext(TestimonialContext);
	return (
		<span
			data-slot="testimonial-verified-badge"
			role="img"
			aria-label="Verified"
			className={cn(testimonial({ variant }).badge(), className)}
			{...props}
		>
			{children ?? (
				<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
					<path d="m8 1.5 1.6 1.2 2-.1.6 1.9 1.7 1-.6 1.9.6 1.9-1.7 1-.6 1.9-2-.1L8 14.5l-1.6-1.2-2 .1-.6-1.9-1.7-1 .6-1.9-.6-1.9 1.7-1 .6-1.9 2 .1L8 1.5Zm2.7 4.1L7.2 9.1 5.4 7.3 4.3 8.4l2.9 2.9 4.6-4.6-1.1-1.1Z" />
				</svg>
			)}
		</span>
	);
}
