"use client";

import type { CSSProperties, FocusEvent, ReactNode } from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { currentHref, groupHrefs, isCurrentSection } from "../current";
import {
	EXPAND_CLOSE_MS,
	EXPAND_OPEN_MS,
	expandSide,
	placeMark,
	slideBox,
} from "../expand";
import { megaNavbar } from "../variants";
import type { MegaMenuGroup, MegaMenuItem, MegaNavLink } from "./mega-navbar";

function Chevron({ className, open }: { className: string; open: boolean }) {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden
			data-open={open}
			className={className}
		>
			<path
				d="m4 6 4 4 4-4"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function Arrow({ className, external }: { className: string; external?: boolean }) {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
			<path
				d={external ? "M5 11 11 5M6 5h5v5" : "M3 8h10M9 4l4 4-4 4"}
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function MenuToggle({ open }: { open: boolean }) {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-5">
			<path
				d={open ? "m4 4 8 8M12 4l-8 8" : "M2 4.5h12M2 8h12M2 11.5h12"}
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
			/>
		</svg>
	);
}

/** Watches an element's height, so the panel can ease to exactly what it holds. */
function useHeights(count: number) {
	const [heights, setHeights] = useState<number[]>([]);
	const nodes = useRef<(HTMLElement | null)[]>([]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: count re-observes when panes are added or removed.
	useLayoutEffect(() => {
		const observer = new ResizeObserver(() =>
			setHeights(nodes.current.map((node) => Math.ceil(node?.scrollHeight ?? 0))),
		);
		for (const node of nodes.current) if (node) observer.observe(node);
		return () => observer.disconnect();
	}, [count]);
	const bind = (index: number) => (node: HTMLElement | null) => {
		nodes.current[index] = node;
	};
	return { heights, bind };
}

export interface MegaNavbarExpandProps {
	brand?: ReactNode;
	groups: MegaMenuGroup[];
	links: MegaNavLink[];
	actions?: ReactNode;
	mobileActions?: ReactNode;
	active?: string;
	sticky: boolean;
	surface: "clear" | "blurred" | "opaque";
	className?: string;
}

/** The expand variant: resting on a section grows the bar itself into a full-width panel for it. */
export function MegaNavbarExpand({
	brand,
	groups,
	links,
	actions,
	mobileActions,
	active,
	sticky,
	surface,
	className,
}: MegaNavbarExpandProps) {
	const styles = megaNavbar({ variant: "expand", sticky, surface });
	const panelId = useId();
	const [open, setOpen] = useState(-1);
	const [mobile, setMobile] = useState(false);
	const openRef = useRef(-1);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const triggers = useRef<(HTMLButtonElement | null)[]>([]);
	const panes = useHeights(groups.length + 1);
	const current = currentHref(groupHrefs(groups, links), active);
	const expanded = open >= 0 || mobile;
	const MOBILE = groups.length;
	const height = mobile ? panes.heights[MOBILE] : open >= 0 ? panes.heights[open] : 0;

	const track = useRef<HTMLDivElement>(null);
	const pill = useRef<HTMLSpanElement>(null);
	const placePill = (target: EventTarget | null) => {
		if (track.current && pill.current)
			placeMark(pill.current, slideBox(track.current, target));
	};

	const cancel = () => {
		if (timer.current) clearTimeout(timer.current);
		timer.current = null;
	};
	const show = (index: number) => {
		cancel();
		openRef.current = index;
		setOpen(index);
	};
	// Once a section is open, moving along the bar switches at once; from rest it waits a beat.
	const aim = (index: number) => {
		if (openRef.current >= 0) return show(index);
		cancel();
		timer.current = setTimeout(() => show(index), EXPAND_OPEN_MS);
	};
	const closeSoon = () => {
		cancel();
		timer.current = setTimeout(() => show(-1), EXPAND_CLOSE_MS);
	};
	const closeAll = () => {
		show(-1);
		setMobile(false);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: show and cancel only touch refs and setters, so one listener serves.
	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			triggers.current[openRef.current]?.focus();
			show(-1);
			setMobile(false);
		};
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
			cancel();
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: placePill reads refs; open and active decide when it reruns.
	useEffect(() => {
		placePill(open >= 0 ? (triggers.current[open] ?? null) : null);
	}, [open, active]);

	const item = (entry: MegaMenuItem, index: number) => (
		<a
			key={entry.href}
			href={entry.href}
			target={entry.external ? "_blank" : undefined}
			rel={entry.external ? "noreferrer" : undefined}
			aria-current={entry.href === current ? "page" : undefined}
			data-current={entry.href === current}
			data-icon={Boolean(entry.icon)}
			style={{ "--i": index } as CSSProperties}
			onClick={closeAll}
			className={styles.expandItem()}
		>
			{entry.icon ? <span className={styles.expandIcon()}>{entry.icon}</span> : null}
			<span className="min-w-0">
				<span className={styles.expandLabel()}>{entry.label}</span>
				{entry.description ? (
					<span className={styles.expandDetail()}>{entry.description}</span>
				) : null}
			</span>
			{entry.external ? <Arrow external className={styles.expandArrow()} /> : <span />}
		</a>
	);

	const grid = (entries: MegaMenuItem[]) => (
		<HighlightGrid className={styles.expandGrid()} highlight={styles.expandHighlight()}>
			{entries.map(item)}
		</HighlightGrid>
	);

	return (
		<div
			data-slot="mega-navbar"
			data-variant="expand"
			className={cn(styles.root(), className)}
		>
			<div
				aria-hidden
				data-open={expanded}
				className={styles.expandScrim()}
				onClick={closeAll}
			/>
			<div className={styles.expandFrame()}>
				<nav
					aria-label="Primary"
					data-open={expanded}
					data-raised={expanded || surface !== "clear"}
					className={styles.expandBar()}
					onMouseEnter={cancel}
					onMouseLeave={closeSoon}
					onBlur={(event: FocusEvent<HTMLElement>) => {
						if (!event.currentTarget.contains(event.relatedTarget)) show(-1);
					}}
				>
					{brand ? <span className={styles.expandBrand()}>{brand}</span> : <span />}

					<div
						ref={track}
						className={styles.expandTriggers()}
						onPointerOver={(event) => placePill(event.target)}
						onPointerLeave={() =>
							placePill(open >= 0 ? (triggers.current[open] ?? null) : null)
						}
					>
						<span ref={pill} aria-hidden className={styles.expandPill()} />
						{groups.map((group, index) => {
							const isOpen = open === index;
							const isCurrent = isCurrentSection(group.href, active);
							return (
								<button
									key={group.label}
									ref={(el) => {
										triggers.current[index] = el;
									}}
									type="button"
									aria-expanded={isOpen}
									aria-controls={panelId}
									data-current={isCurrent}
									className={styles.expandTrigger({ current: isOpen || isCurrent })}
									onMouseEnter={() => aim(index)}
									onClick={() => show(isOpen ? -1 : index)}
									onKeyDown={(event) => {
										if (event.key !== "ArrowDown") return;
										event.preventDefault();
										show(index);
										// The pane is inert until the open state renders.
										requestAnimationFrame(() =>
											document
												.getElementById(`${panelId}-${index}`)
												?.querySelector<HTMLElement>("a")
												?.focus(),
										);
									}}
								>
									{group.label}
									<Chevron open={isOpen} className={styles.expandChevron()} />
								</button>
							);
						})}
						{links.map((link) => (
							<a
								key={link.href}
								href={link.href}
								target={link.external ? "_blank" : undefined}
								rel={link.external ? "noreferrer" : undefined}
								aria-current={link.href === current ? "page" : undefined}
								data-current={link.href === current}
								onMouseEnter={closeSoon}
								className={styles.expandTrigger({ current: link.href === current })}
							>
								{link.label}
							</a>
						))}
					</div>

					<div className={styles.expandActions()}>
						{actions ? (
							<span className="hidden items-center gap-2 @3xl:flex">{actions}</span>
						) : null}
						<button
							type="button"
							aria-label={mobile ? "Close menu" : "Open menu"}
							aria-expanded={mobile}
							aria-controls={`${panelId}-mobile`}
							className={styles.menuButton()}
							onClick={() => {
								show(-1);
								setMobile((value) => !value);
							}}
						>
							<MenuToggle open={mobile} />
						</button>
					</div>

					<div
						id={panelId}
						data-open={expanded}
						className={styles.expandPanel()}
						style={{ height: height ?? 0 }}
					>
						<span aria-hidden data-open={expanded} className={styles.expandDivider()} />
						<div className={styles.expandPanes()}>
							{groups.map((group, index) => {
								const side = mobile ? "off" : expandSide(index, open);
								return (
									<section
										key={group.label}
										id={`${panelId}-${index}`}
										ref={panes.bind(index)}
										aria-label={group.label}
										data-side={side}
										inert={side !== "on"}
										className={styles.expandPane()}
									>
										<div className={styles.expandIntro()}>
											<p className={styles.expandEyebrow()}>
												{group.eyebrow ?? group.label}
											</p>
											{group.description ? (
												<p className={styles.expandBlurb()}>{group.description}</p>
											) : null}
											{group.footer ? (
												<a
													href={group.footer.href}
													onClick={closeAll}
													className={styles.expandCta()}
												>
													{group.footer.label}
													<Arrow className="size-3.5 transition-transform group-hover/cta:translate-x-0.5 motion-reduce:transition-none" />
												</a>
											) : null}
										</div>
										<div>
											{grid(group.items)}
											{group.more?.links.length ? (
												<div className={styles.expandMore()}>
													{group.more.links.map((link) => (
														<a
															key={link.href}
															href={link.href}
															target={link.external ? "_blank" : undefined}
															rel={link.external ? "noreferrer" : undefined}
															onClick={closeAll}
															className={styles.expandMoreLink()}
														>
															{link.label}
														</a>
													))}
												</div>
											) : null}
										</div>
									</section>
								);
							})}
						</div>

						<div
							id={`${panelId}-mobile`}
							ref={panes.bind(MOBILE)}
							data-side={mobile ? "on" : "off"}
							inert={!mobile}
							className={styles.expandMobile()}
						>
							{groups.map((group) => (
								<section
									key={group.label}
									aria-label={group.label}
									className={styles.expandMobileGroup()}
								>
									<p className={cn(styles.expandEyebrow(), "px-3 pb-1")}>{group.label}</p>
									{grid(group.items)}
								</section>
							))}
							{links.length ? (
								<div className={styles.expandMobileGroup()}>
									{grid(links.map((link) => ({ ...link, description: undefined })))}
								</div>
							) : null}
							{(mobileActions ?? actions) ? (
								<div
									className={cn(styles.expandMobileGroup(), "flex flex-col gap-2 px-1")}
								>
									{mobileActions ?? actions}
								</div>
							) : null}
						</div>
					</div>
				</nav>
			</div>
		</div>
	);
}

/** An item grid with one highlight that slides to the hovered or focused item. */
function HighlightGrid({
	className,
	highlight,
	children,
}: {
	className: string;
	highlight: string;
	children: ReactNode;
}) {
	const grid = useRef<HTMLDivElement>(null);
	const mark = useRef<HTMLSpanElement>(null);
	const place = (target: EventTarget | null) => {
		if (grid.current && mark.current)
			placeMark(mark.current, slideBox(grid.current, target));
	};
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: hover region for the highlight; the links inside are the controls
		<div
			ref={grid}
			className={className}
			onPointerOver={(event) => place(event.target)}
			onPointerLeave={() => place(null)}
			onFocus={(event) => place(event.target)}
		>
			<span ref={mark} aria-hidden className={highlight} />
			{children}
		</div>
	);
}
