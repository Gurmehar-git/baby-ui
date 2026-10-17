"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useId,
	useState,
} from "react";
import { Button } from "../../button/react/button";
import type { ButtonVariant } from "../../button/variants";
import { cn } from "../../lib/cn";
import { type CtaSectionVariant, ctaSection } from "../variants";

export type { CtaSectionVariant };

type CtaSectionState = {
	variant: CtaSectionVariant;
	titleId: string;
	close: () => void;
	styles: ReturnType<typeof ctaSection>;
};

const CtaSectionContext = createContext<CtaSectionState | null>(null);

function useCtaSection() {
	const state = useContext(CtaSectionContext);
	if (!state) throw new Error("CtaSection parts must be rendered inside a CtaSection.");
	return state;
}

function Glyph({ d, className }: { d: string; className?: string }) {
	return (
		<svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className={className}>
			<path
				d={d}
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export interface CtaSectionProps extends ComponentProps<"section"> {
	/** `centered` closes a page, `split` sits beside a visual, `banner` is one line. */
	variant?: CtaSectionVariant;
	/** Banner: whether it is shown; folds closed when false. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

/**
 * A call to action from parts: CtaSectionContent (title, description, points, actions, note),
 * beside CtaSectionVisual in the split variant; the banner adds CtaSectionDismiss.
 */
export function CtaSection({
	variant = "centered",
	open: openProp,
	onOpenChange,
	className,
	children,
	...props
}: CtaSectionProps) {
	const titleId = useId();
	const styles = ctaSection({ variant });
	const [ownOpen, setOwnOpen] = useState(true);
	const open = openProp ?? ownOpen;
	const close = () => {
		if (openProp === undefined) setOwnOpen(false);
		onOpenChange?.(false);
	};
	return (
		<CtaSectionContext.Provider value={{ variant, titleId, close, styles }}>
			<section
				data-slot="cta-section"
				data-variant={variant}
				aria-labelledby={titleId}
				className={cn(styles.root(), className)}
				{...props}
			>
				{variant === "banner" ? (
					<div data-open={open} inert={!open} className={styles.collapse()}>
						<div className={styles.collapseInner()}>
							<div className={styles.wrap()}>
								<div className={styles.banner()}>{children}</div>
							</div>
						</div>
					</div>
				) : (
					<div className={styles.wrap()}>
						<div className={styles.panel()}>{children}</div>
					</div>
				)}
			</section>
		</CtaSectionContext.Provider>
	);
}

/** Text parts switch element in the banner, so they take only a class and children. */
export interface CtaSectionTextProps {
	className?: string;
	children?: ReactNode;
}

/** The copy column; one line of text in the banner. */
export function CtaSectionContent({ className, children }: CtaSectionTextProps) {
	const { variant, styles } = useCtaSection();
	if (variant === "banner")
		return (
			<p data-slot="cta-section-content" className={cn(styles.bannerText(), className)}>
				{children}
			</p>
		);
	return (
		<div data-slot="cta-section-content" className={cn(styles.copy(), className)}>
			{children}
		</div>
	);
}

/** The heading that names the section; inline in the banner. */
export function CtaSectionTitle({ className, children }: CtaSectionTextProps) {
	const { variant, titleId, styles } = useCtaSection();
	if (variant === "banner")
		return (
			<strong
				data-slot="cta-section-title"
				id={titleId}
				className={cn(styles.bannerTitle(), className)}
			>
				{children}
			</strong>
		);
	return (
		<h2
			data-slot="cta-section-title"
			id={titleId}
			className={cn(styles.title(), className)}
		>
			{children}
		</h2>
	);
}

export function CtaSectionDescription({ className, children }: CtaSectionTextProps) {
	const { variant, styles } = useCtaSection();
	if (variant === "banner")
		return (
			<span
				data-slot="cta-section-description"
				className={cn(styles.bannerDescription(), className)}
			>
				{children}
			</span>
		);
	return (
		<p
			data-slot="cta-section-description"
			className={cn(styles.description(), className)}
		>
			{children}
		</p>
	);
}

/** Benefit lines, each with a check; holds CtaSectionPoint items. */
export function CtaSectionPoints({ className, ...props }: ComponentProps<"ul">) {
	const { styles } = useCtaSection();
	return (
		<ul
			data-slot="cta-section-points"
			className={cn(styles.points(), className)}
			{...props}
		/>
	);
}

export function CtaSectionPoint({ className, children, ...props }: ComponentProps<"li">) {
	const { styles } = useCtaSection();
	return (
		<li
			data-slot="cta-section-point"
			className={cn(styles.point(), className)}
			{...props}
		>
			<Glyph d="M3.5 8.5 6.5 11.5 12.5 4.5" />
			{children}
		</li>
	);
}

export function CtaSectionActions({ className, ...props }: ComponentProps<"div">) {
	const { variant, styles } = useCtaSection();
	return (
		<div
			data-slot="cta-section-actions"
			className={cn(
				variant === "banner" ? styles.bannerActions() : styles.actions(),
				className,
			)}
			{...props}
		/>
	);
}

export interface CtaSectionActionProps {
	/** Renders a link. */
	href?: string;
	onClick?: () => void;
	/** `default` is the primary action and leans its arrow on hover; use `outline` for the secondary. */
	variant?: ButtonVariant;
	className?: string;
	children?: ReactNode;
}

export function CtaSectionAction({
	href,
	onClick,
	variant = "default",
	className,
	children,
}: CtaSectionActionProps) {
	const { variant: layout, styles } = useCtaSection();
	const banner = layout === "banner";
	return (
		<Button
			data-slot="cta-section-action"
			size={banner ? "sm" : "lg"}
			variant={variant}
			href={href}
			onClick={onClick}
			className={cn(!banner && styles.action(), className)}
		>
			{children}
			{variant === "default" ? (
				<Glyph d="M3 8h10M9 4l4 4-4 4" className={styles.arrow()} />
			) : null}
		</Button>
	);
}

/** Small print under the actions, e.g. "No credit card required"; faces can go inside. */
export function CtaSectionNote({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useCtaSection();
	return (
		<div
			data-slot="cta-section-note"
			className={cn(styles.note(), className)}
			{...props}
		/>
	);
}

/** The split variant's right-hand side, e.g. a product shot. */
export function CtaSectionVisual({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useCtaSection();
	return (
		<div
			data-slot="cta-section-visual"
			className={cn(styles.stage(), className)}
			{...props}
		/>
	);
}

/** The banner's close button; folds the banner away. */
export function CtaSectionDismiss({
	"aria-label": ariaLabel = "Dismiss",
	className,
}: {
	"aria-label"?: string;
	className?: string;
}) {
	const { close } = useCtaSection();
	return (
		<Button
			data-slot="cta-section-dismiss"
			size="icon-sm"
			variant="ghost"
			aria-label={ariaLabel}
			onClick={close}
			className={className}
		>
			<Glyph d="M4 4l8 8M12 4l-8 8" />
		</Button>
	);
}
