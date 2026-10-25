"use client";

import {
	type ComponentProps,
	type CSSProperties,
	createContext,
	type ReactNode,
	useContext,
} from "react";
import { CopyButton } from "../../copy-button/react/copy-button";
import { cn } from "../../lib/cn";
import { type WallHeroDirection, type WallHeroVariant, wallHero } from "../variants";

type Ctx = { styles: ReturnType<typeof wallHero> };
const WallHeroContext = createContext<Ctx | null>(null);

function useWallHero(part: string): Ctx {
	const ctx = useContext(WallHeroContext);
	if (!ctx) throw new Error(`${part} must be used inside <WallHero>`);
	return ctx;
}

export interface WallHeroProps extends ComponentProps<"section"> {
	variant?: WallHeroVariant;
}

/** The root: copy and a tilted wall of cards that drift past, beside it or behind it. */
export function WallHero({
	variant = "split",
	className,
	children,
	...props
}: WallHeroProps) {
	const styles = wallHero({ variant });
	return (
		<WallHeroContext.Provider value={{ styles }}>
			<section
				data-slot="wall-hero"
				data-variant={variant}
				className={cn(styles.root(), className)}
				{...props}
			>
				{children}
			</section>
		</WallHeroContext.Provider>
	);
}

export function WallHeroContent({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useWallHero("WallHeroContent");
	return (
		<div
			data-slot="wall-hero-content"
			className={cn(styles.content(), className)}
			{...props}
		/>
	);
}

/** A logo mark and the product name. */
export function WallHeroBrand({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useWallHero("WallHeroBrand");
	return (
		<div
			data-slot="wall-hero-brand"
			className={cn(styles.brand(), className)}
			{...props}
		/>
	);
}

export function WallHeroTitle({ className, ...props }: ComponentProps<"h1">) {
	const { styles } = useWallHero("WallHeroTitle");
	return (
		<h1
			data-slot="wall-hero-title"
			className={cn(styles.title(), className)}
			{...props}
		/>
	);
}

export function WallHeroDescription({ className, ...props }: ComponentProps<"p">) {
	const { styles } = useWallHero("WallHeroDescription");
	return (
		<p
			data-slot="wall-hero-description"
			className={cn(styles.description(), className)}
			{...props}
		/>
	);
}

/** An install command in a pill, with a copy button. */
export function WallHeroCommand({
	command,
	prompt = "$",
	copyLabel = "Copy command",
	className,
}: {
	command: string;
	prompt?: string;
	copyLabel?: string;
	className?: string;
}) {
	const { styles } = useWallHero("WallHeroCommand");
	return (
		<div data-slot="wall-hero-command" className={cn(styles.command(), className)}>
			<span aria-hidden="true" className={styles.prompt()}>
				{prompt}
			</span>
			<code className={styles.commandText()}>{command}</code>
			<CopyButton text={command} iconOnly label={copyLabel} className={styles.copy()} />
		</div>
	);
}

export function WallHeroActions({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useWallHero("WallHeroActions");
	return (
		<div
			data-slot="wall-hero-actions"
			className={cn(styles.actions(), className)}
			{...props}
		/>
	);
}

/** The tilted plane of columns. Decoration only: hidden from assistive tech and inert. */
export function WallHeroWall({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { styles } = useWallHero("WallHeroWall");
	return (
		<div
			data-slot="wall-hero-wall"
			aria-hidden="true"
			inert
			className={cn(styles.wall(), className)}
		>
			<div data-motion="explanatory" className={styles.plane()}>
				{children}
			</div>
		</div>
	);
}

/** One column of cards, drawn twice so its drift loops without a seam. */
export function WallHeroColumn({
	direction = "up",
	duration,
	className,
	children,
}: {
	direction?: WallHeroDirection;
	/** One full loop, e.g. "70s". Defaults to `--wall-hero-duration` (60s). */
	duration?: string;
	className?: string;
	children?: ReactNode;
}) {
	const { styles } = useWallHero("WallHeroColumn");
	const style = duration
		? ({ "--wall-hero-duration": duration } as CSSProperties)
		: undefined;
	return (
		<div data-slot="wall-hero-column" className={cn(styles.column(), className)}>
			<div data-direction={direction} className={styles.track()} style={style}>
				<div className={styles.group()}>{children}</div>
				<div className={styles.group()}>{children}</div>
			</div>
		</div>
	);
}

/** A framed tile on the wall; put any component inside. */
export function WallHeroCard({ className, children, ...props }: ComponentProps<"div">) {
	const { styles } = useWallHero("WallHeroCard");
	return (
		<div data-slot="wall-hero-card" className={cn(styles.card(), className)} {...props}>
			<div className={styles.cardBody()}>{children}</div>
		</div>
	);
}
