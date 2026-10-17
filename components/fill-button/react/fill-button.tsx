"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { type FillButtonSize, type FillButtonTone, fillButton } from "../variants";

export type { FillButtonSize, FillButtonTone };

function ArrowIcon() {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden>
			<path
				d="M3 8h10M9 4l4 4-4 4"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

type BaseProps = {
	/** Label; also rendered on the fill as a decorative copy. */
	children: ReactNode;
	/** Icon inside the tile. Defaults to an arrow. */
	icon?: ReactNode;
	tone?: FillButtonTone;
	size?: FillButtonSize;
	className?: string;
};

export type FillButtonProps = BaseProps &
	(
		| ({ href: string } & Omit<
				AnchorHTMLAttributes<HTMLAnchorElement>,
				"children" | "className"
		  >)
		| ({ href?: undefined } & Omit<
				ButtonHTMLAttributes<HTMLButtonElement>,
				"children" | "className"
		  >)
	);

/** A call to action whose icon tile expands into a full fill on hover or keyboard focus. */
export function FillButton({
	children,
	icon,
	tone,
	size,
	className,
	...rest
}: FillButtonProps) {
	const s = fillButton({ tone, size });
	const inner = (
		<>
			<span aria-hidden className={s.fill()} />
			<span aria-hidden className={s.track()}>
				<span className={s.icon()}>{icon ?? <ArrowIcon />}</span>
			</span>
			<span className={s.label()}>{children}</span>
			<span aria-hidden className={s.fillLabel()}>
				{children}
			</span>
		</>
	);

	if (rest.href !== undefined) {
		return (
			<a
				{...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
				data-slot="fill-button"
				className={cn(s.root(), className)}
			>
				{inner}
			</a>
		);
	}
	const { type = "button", ...buttonRest } =
		rest as ButtonHTMLAttributes<HTMLButtonElement>;
	return (
		<button
			{...buttonRest}
			type={type}
			data-slot="fill-button"
			className={cn(s.root(), className)}
		>
			{inner}
		</button>
	);
}
