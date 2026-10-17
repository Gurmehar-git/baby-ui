"use client";

import { type ReactNode, useId, useState } from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarImage,
} from "../../avatar/react/avatar";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/cn";
import type { CtaAction } from "../types";
import { type CtaSectionVariant, ctaSection } from "../variants";

export type { CtaAction, CtaSectionVariant };

export interface CtaSectionProps {
	title: string;
	primaryAction: CtaAction;
	/** `centered` closes a page, `split` sits beside a visual, `banner` is one line. */
	variant?: CtaSectionVariant;
	description?: string;
	/** Not shown in the banner. */
	secondaryAction?: CtaAction;
	/** Small print under the actions in the centered variant. */
	note?: string;
	/** Faces beside the note in the centered variant; four at most. */
	avatars?: { src: string; alt?: string }[];
	/** Short benefit lines in the split variant. */
	points?: string[];
	/** The split variant's right-hand side, e.g. a product shot. */
	visual?: ReactNode;
	/** Banner: shows a dismiss button. */
	dismissible?: boolean;
	/** Banner: whether it is shown; folds closed when false. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
}

const ARROW = "M3 8h10M9 4l4 4-4 4";
const CHECK = "M3.5 8.5 6.5 11.5 12.5 4.5";

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

/** A call to action: a centred closing section, a split layout beside a visual, or a dismissible banner. */
export function CtaSection({
	title,
	primaryAction,
	variant = "centered",
	description,
	secondaryAction,
	note,
	avatars = [],
	points = [],
	visual,
	dismissible = false,
	open: openProp,
	onOpenChange,
	className,
}: CtaSectionProps) {
	const id = useId();
	const s = ctaSection({ variant });
	const [ownOpen, setOwnOpen] = useState(true);
	const open = openProp ?? ownOpen;
	const close = () => {
		if (openProp === undefined) setOwnOpen(false);
		onOpenChange?.(false);
	};
	const action = (item: CtaAction, primary: boolean, size: "sm" | "lg" = "lg") => (
		<Button
			size={size}
			variant={primary ? "default" : "outline"}
			href={item.href}
			onClick={item.onClick}
			className={size === "sm" ? undefined : s.action()}
		>
			{item.label}
			{primary ? <Glyph d={ARROW} className={s.arrow()} /> : null}
		</Button>
	);

	if (variant === "banner") {
		return (
			<section
				data-slot="cta-section"
				data-variant={variant}
				aria-labelledby={`${id}-title`}
				className={cn(s.root(), className)}
			>
				<div data-open={open} inert={!open} className={s.collapse()}>
					<div className={s.collapseInner()}>
						<div className={s.wrap()}>
							<div className={s.banner()}>
								<p className={s.bannerText()}>
									<strong id={`${id}-title`} className={s.bannerTitle()}>
										{title}
									</strong>
									{description ? (
										<span className={s.bannerDescription()}>{description}</span>
									) : null}
								</p>
								<div className={s.bannerActions()}>
									{action(primaryAction, true, "sm")}
									{dismissible ? (
										<Button
											size="icon-sm"
											variant="ghost"
											aria-label="Dismiss"
											onClick={close}
										>
											<Glyph d="M4 4l8 8M12 4l-8 8" />
										</Button>
									) : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}

	const copy = (
		<div className={s.copy()}>
			<h2 id={`${id}-title`} className={s.title()}>
				{title}
			</h2>
			{description ? <p className={s.description()}>{description}</p> : null}
			{variant === "split" && points.length ? (
				<ul className={s.points()}>
					{points.map((point) => (
						<li key={point} className={s.point()}>
							<Glyph d={CHECK} />
							{point}
						</li>
					))}
				</ul>
			) : null}
			<div className={s.actions()}>
				{action(primaryAction, true)}
				{secondaryAction ? action(secondaryAction, false) : null}
			</div>
			{variant === "centered" && (note || avatars.length) ? (
				<div className={s.note()}>
					{avatars.length ? (
						<AvatarGroup aria-hidden="true">
							{avatars.slice(0, 4).map((face) => (
								<Avatar key={face.src} size="sm" className="size-6.5">
									<AvatarImage src={face.src} alt={face.alt ?? ""} />
									<AvatarFallback>{(face.alt ?? "").charAt(0)}</AvatarFallback>
								</Avatar>
							))}
						</AvatarGroup>
					) : null}
					{note}
				</div>
			) : null}
		</div>
	);

	return (
		<section
			data-slot="cta-section"
			data-variant={variant}
			aria-labelledby={`${id}-title`}
			className={cn(s.root(), className)}
		>
			<div className={s.wrap()}>
				<div className={s.panel()}>
					{copy}
					{variant === "split" && visual ? (
						<div className={s.stage()}>{visual}</div>
					) : null}
				</div>
			</div>
		</section>
	);
}
