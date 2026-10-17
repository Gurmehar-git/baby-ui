import { type ComponentProps, createContext, type ReactNode, useContext } from "react";
import { Badge } from "../../badge/react/badge";
import { Button } from "../../button/react/button";
import type { ButtonVariant } from "../../button/variants";
import { CopyButton } from "../../copy-button/react/copy-button";
import { cn } from "../../lib/cn";
import {
	type GradientHero01Size,
	type GradientHero01Tone,
	gradientHero01,
} from "../variants";

export type { GradientHero01Size, GradientHero01Tone };

const GradientHero01Context = createContext<ReturnType<typeof gradientHero01> | null>(
	null,
);

function useGradientHero01() {
	const styles = useContext(GradientHero01Context);
	if (!styles)
		throw new Error("GradientHero01 parts must be rendered inside a GradientHero01.");
	return styles;
}

export interface GradientHero01Props extends ComponentProps<"section"> {
	tone?: GradientHero01Tone;
	size?: GradientHero01Size;
}

/**
 * A hero over a soft glow: GradientHero01Content (badge, title, description, actions, install,
 * meta), plus an optional GradientHero01Media that switches it to a split layout.
 */
export function GradientHero01({
	tone = "chart",
	size = "screen",
	className,
	children,
	...props
}: GradientHero01Props) {
	const styles = gradientHero01({ tone, size });
	return (
		<GradientHero01Context.Provider value={styles}>
			<section
				data-slot="gradient-hero-01"
				className={cn(styles.root(), className)}
				{...props}
			>
				<div aria-hidden className={styles.blob()} />
				<div aria-hidden className={styles.wash()} />
				<div aria-hidden className={styles.vignette()} />
				<div aria-hidden className={styles.fade()} />
				<div className={styles.inner()}>{children}</div>
			</section>
		</GradientHero01Context.Provider>
	);
}

export function GradientHero01Content({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="gradient-hero-01-content"
			className={cn(useGradientHero01().copy(), className)}
			{...props}
		/>
	);
}

/** The pill above the headline. */
export function GradientHero01Badge({
	className,
	...props
}: ComponentProps<typeof Badge>) {
	return (
		<Badge
			variant="outline"
			className={cn(useGradientHero01().badge(), className)}
			{...props}
		/>
	);
}

export function GradientHero01Title({ className, ...props }: ComponentProps<"h1">) {
	return (
		<h1
			data-slot="gradient-hero-01-title"
			className={cn(useGradientHero01().title(), className)}
			{...props}
		/>
	);
}

export function GradientHero01Description({ className, ...props }: ComponentProps<"p">) {
	return (
		<p
			data-slot="gradient-hero-01-description"
			className={cn(useGradientHero01().description(), className)}
			{...props}
		/>
	);
}

export function GradientHero01Actions({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="gradient-hero-01-actions"
			className={cn(useGradientHero01().actions(), className)}
			{...props}
		/>
	);
}

export interface GradientHero01ActionProps {
	/** Renders a link; otherwise a button calling `onClick`. */
	href?: string;
	onClick?: () => void;
	/** `default` for the primary action, `outline` for the rest. */
	variant?: ButtonVariant;
	className?: string;
	children?: ReactNode;
}

export function GradientHero01Action({
	href,
	onClick,
	variant = "default",
	className,
	children,
}: GradientHero01ActionProps) {
	return (
		<Button
			data-slot="gradient-hero-01-action"
			href={href}
			onClick={onClick}
			variant={variant}
			size="lg"
			className={cn(useGradientHero01().action(), className)}
		>
			{children}
		</Button>
	);
}

/** An install command in a pill with a copy button, e.g. `npm i acme`. */
export function GradientHero01Install({
	command,
	className,
}: {
	command: string;
	className?: string;
}) {
	return (
		<div
			data-slot="gradient-hero-01-install"
			className={cn(useGradientHero01().install(), className)}
		>
			<span aria-hidden>$</span>
			<code>{command}</code>
			<CopyButton text={command} label="Copy install command" iconOnly />
		</div>
	);
}

/** Small facts under the actions, e.g. the version and licence; one `<li>` each. */
export function GradientHero01Meta({ className, ...props }: ComponentProps<"ul">) {
	return (
		<ul
			data-slot="gradient-hero-01-meta"
			className={cn(useGradientHero01().meta(), className)}
			{...props}
		/>
	);
}

/** A visual beside the copy, e.g. a product shot; the hero switches to a split layout. */
export function GradientHero01Media({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="gradient-hero-01-media"
			className={cn(useGradientHero01().media(), className)}
			{...props}
		/>
	);
}
