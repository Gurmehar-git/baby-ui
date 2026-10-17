"use client";

import { type CSSProperties, type PointerEvent, type ReactNode, useState } from "react";
import { cn } from "../../lib/cn";
import { baseVars, hoverLayers } from "../effects";
import {
	type HoverTransitionDirection,
	type HoverTransitionEffect,
	hoverTransition,
} from "../variants";

export type { HoverTransitionDirection, HoverTransitionEffect };

export interface HoverTransitionProps {
	/** Resting content. */
	children: ReactNode;
	/** Content revealed on hover or keyboard focus. */
	hoverContent: ReactNode;
	effect?: HoverTransitionEffect;
	/** Where the reveal starts or which way it travels. */
	direction?: HoverTransitionDirection;
	durationMs?: number;
	/** Tilt a couple of degrees toward a mouse pointer. */
	tilt?: boolean;
	/** Controlled: whether the hover content is shown. */
	active?: boolean;
	defaultActive?: boolean;
	onActiveChange?: (active: boolean) => void;
	/** Accessible name of the focusable wrapper. */
	label?: string;
	className?: string;
}

const MAX_TILT = 2.4;

export function HoverTransition({
	children,
	hoverContent,
	effect = "wipe",
	direction = "right",
	durationMs = 720,
	tilt = true,
	active: activeProp,
	defaultActive = false,
	onActiveChange,
	label = "Hover to reveal more",
	className,
}: HoverTransitionProps) {
	const [internal, setInternal] = useState(defaultActive);
	const active = activeProp ?? internal;
	const styles = hoverTransition({ effect, direction });
	const layers = hoverLayers(effect, direction, active);
	const firstHover = layers.findIndex((layer) => layer.content === "hover");

	const setActive = (next: boolean) => {
		if (next === active) return;
		setInternal(next);
		onActiveChange?.(next);
	};

	const track = (event: PointerEvent<HTMLDivElement>) => {
		if (!tilt || event.pointerType !== "mouse") return;
		const box = event.currentTarget.getBoundingClientRect();
		const x = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
		const y = Math.min(1, Math.max(0, (event.clientY - box.top) / box.height));
		event.currentTarget.style.setProperty(
			"--ht-tilt-x",
			`${((0.5 - y) * MAX_TILT).toFixed(2)}deg`,
		);
		event.currentTarget.style.setProperty(
			"--ht-tilt-y",
			`${((x - 0.5) * MAX_TILT).toFixed(2)}deg`,
		);
	};

	const untilt = (event: PointerEvent<HTMLDivElement>) => {
		event.currentTarget.style.setProperty("--ht-tilt-x", "0deg");
		event.currentTarget.style.setProperty("--ht-tilt-y", "0deg");
	};

	return (
		// biome-ignore lint/a11y/useSemanticElements: a fieldset would add form semantics to a card
		<div
			data-slot="hover-transition"
			data-effect={effect}
			data-active={active ? "true" : "false"}
			role="group"
			aria-label={label}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: focus is how keyboard users trigger the reveal
			tabIndex={0}
			className={cn(styles.root(), className)}
			style={{ "--ht-duration": `${durationMs}ms` } as CSSProperties}
			onMouseEnter={() => setActive(true)}
			onMouseLeave={() => setActive(false)}
			onFocus={() => setActive(true)}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) setActive(false);
			}}
			onPointerMove={track}
			onPointerLeave={untilt}
		>
			<div data-active={active ? "true" : "false"} className={styles.stage()}>
				<div
					aria-hidden={active ? true : undefined}
					inert={active}
					className={styles.base()}
					style={baseVars(effect, active) as CSSProperties}
				>
					{children}
				</div>
				{layers.map((layer, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
						key={i}
						data-exposed={i === firstHover && active ? "true" : undefined}
						aria-hidden={i === firstHover && active ? undefined : true}
						inert={!(i === firstHover && active)}
						className={styles.layer()}
						style={layer.vars as CSSProperties}
					>
						{layer.inner ? (
							<div className={styles.inner()} style={layer.inner as CSSProperties}>
								{layer.content === "hover" ? hoverContent : children}
							</div>
						) : layer.content === "hover" ? (
							hoverContent
						) : (
							children
						)}
					</div>
				))}
			</div>
		</div>
	);
}
