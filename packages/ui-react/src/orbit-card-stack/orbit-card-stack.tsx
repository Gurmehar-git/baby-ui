"use client";

import {
	type FocusEvent,
	type KeyboardEvent,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { Badge } from "../badge/badge";
import { Button } from "../button/button";
import { cn } from "../lib/cn";
import type { ImageSlotProps } from "../lib/image";
import {
	clampIndex,
	DEFAULT_ORBIT_LABELS,
	type GridFit,
	gridFit,
	initialsFor,
	nextIndex,
	type OrbitCardStackLabels,
	type OrbitCardStackLayout,
	type OrbitCardStackSize,
	type OrbitStackItem,
	orbitCardStack,
	orbitTransform,
} from "./variants";

export type {
	OrbitCardStackLabels,
	OrbitCardStackLayout,
	OrbitCardStackSize,
	OrbitStackItem,
};

export interface OrbitCardStackProps {
	items: readonly OrbitStackItem[];
	/** Controlled index of the active (front) card. */
	value?: number;
	/** Front card before any interaction; defaults to the middle one. */
	defaultValue?: number;
	onValueChange?: (index: number) => void;
	/** Controlled fan state: true spreads the cards out. */
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Largest gap between open cards in px; shrinks to fit the stage. */
	spread?: number;
	/** How far the active open card rises, in px. */
	lift?: number;
	size?: OrbitCardStackSize;
	layout?: OrbitCardStackLayout;
	labels?: Partial<OrbitCardStackLabels>;
	/** Renders each image, e.g. through your framework's image component; defaults to `<img>`. */
	image?: (props: ImageSlotProps) => ReactNode;
	className?: string;
}

/** Profile cards piled in a stack that fan out on hover or focus and raise the active one. */
export function OrbitCardStack({
	items,
	value: valueProp,
	defaultValue,
	onValueChange,
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	spread = 168,
	lift = 34,
	size,
	layout = "arc",
	labels,
	image,
	className,
}: OrbitCardStackProps) {
	const stage = useRef<HTMLUListElement>(null);
	const count = items.length;
	const [innerValue, setInnerValue] = useState(
		defaultValue ?? Math.floor((count - 1) / 2),
	);
	const [innerOpen, setInnerOpen] = useState(defaultOpen);
	const active = clampIndex(valueProp ?? innerValue, count);
	const open = openProp ?? innerOpen;
	const l = { ...DEFAULT_ORBIT_LABELS, ...labels };
	const s = orbitCardStack({ size, layout });
	const [fit, setFit] = useState<GridFit>();

	useEffect(() => {
		const el = stage.current;
		if (layout !== "grid" || !el) return;
		const measure = () => {
			const card = el.querySelector<HTMLElement>("[data-orbit-card]");
			if (card)
				setFit(
					gridFit(
						el.clientWidth,
						el.clientHeight,
						card.offsetWidth,
						card.offsetHeight,
						count,
					),
				);
		};
		measure();
		const resize = new ResizeObserver(measure);
		resize.observe(el);
		return () => resize.disconnect();
	}, [layout, count]);

	const setOpen = (next: boolean) => {
		if (next === open) return;
		if (openProp === undefined) setInnerOpen(next);
		onOpenChange?.(next);
	};
	const activate = (index: number) => {
		setOpen(true);
		if (index === active) return;
		if (valueProp === undefined) setInnerValue(index);
		onValueChange?.(index);
	};

	const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
		if (event.key === "Escape") {
			(document.activeElement as HTMLElement | null)?.blur();
			return setOpen(false);
		}
		const next = nextIndex(event.key, active, count);
		if (next === undefined) return;
		event.preventDefault();
		activate(next);
		stage.current?.querySelectorAll<HTMLElement>("[data-orbit-card]")[next]?.focus();
	};

	return (
		<div data-slot="orbit-card-stack" className={cn(s.root(), className)}>
			<ul
				ref={stage}
				aria-label={l.group}
				data-state={open ? "open" : "closed"}
				className={s.stage()}
				onMouseLeave={() => setOpen(false)}
				onBlur={(event: FocusEvent<HTMLUListElement>) => {
					if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
				}}
				onKeyDown={onKeyDown}
			>
				{items.map((item, i) => {
					const current = i === active;
					const initials = initialsFor(item);
					return (
						<li
							// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
							key={`${item.name}-${i}`}
							data-orbit-card=""
							tabIndex={current ? 0 : -1}
							aria-current={current ? "true" : undefined}
							className={s.card()}
							style={{
								zIndex: current ? 80 : 50 - Math.abs(i - active),
								transform: orbitTransform(
									i,
									count,
									active,
									open,
									layout,
									spread,
									lift,
									fit,
								),
							}}
							onMouseEnter={() => activate(i)}
							onFocus={() => activate(i)}
						>
							<div className={s.portrait()}>
								{item.image ? (
									image ? (
										image({ src: item.image, alt: "", className: s.portraitImage() })
									) : (
										<img
											src={item.image}
											alt={""}
											className={s.portraitImage()}
											decoding="async"
											draggable={false}
										/>
									)
								) : (
									<span aria-hidden className={s.monogram()}>
										{initials}
									</span>
								)}
								<Badge variant="default" className={s.initials()}>
									{initials}
								</Badge>
							</div>
							{item.href ? (
								<Button
									href={item.href}
									size="icon-lg"
									aria-label={`${l.link} ${item.name}`}
									tabIndex={current ? 0 : -1}
									className={s.link()}
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden
									>
										<path d="M17 7l-10 10" />
										<path d="M8 7l9 0l0 9" />
									</svg>
								</Button>
							) : null}
							<div className={s.body()}>
								{item.role ? <p className={s.role()}>{item.role}</p> : null}
								<h3 className={s.name()}>{item.name}</h3>
								{item.description ? (
									<p className={s.description()}>{item.description}</p>
								) : null}
								{item.stat ? <div className={s.stat()}>{item.stat}</div> : null}
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
