"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { Collapsible, CollapsibleContent } from "../../collapsible/react/collapsible";
import { cn } from "../../lib/cn";
import { pillStyle } from "../../lib/pill";
import { NotchedShelf } from "../../notched-shelf/react/notched-shelf";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../sheet/react/sheet";
import { capsuleBox, currentHref, groupHrefs, isCurrentSection } from "../current";
import { type MegaNavbarVariant, megaNavbar } from "../variants";
import { MegaNavbarExpand } from "./expand-nav";

export type { MegaNavbarVariant };

export type MegaNavLink = { label: string; href: string; external?: boolean };

export type MegaMenuItem = {
	label: string;
	href: string;
	description?: string;
	icon?: ReactNode;
	external?: boolean;
};

export type MegaMenuGroup = {
	label: string;
	href: string;
	/** A short kicker over the description; the expand variant's panel intro. */
	eyebrow?: string;
	/** What the section is for, beside its items in the expand variant's panel. */
	description?: string;
	items: MegaMenuItem[];
	/** Secondary links under the items, one line each in columns. */
	more?: { heading?: string; links: MegaNavLink[] };
	footer?: { label: string; href: string; hint?: string };
};

function ChevronDown({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
			<path
				d="m4 6 4 4 4-4"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function ArrowUpRight({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
			<path
				d="M5 11 11 5M6 5h5v5"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function ArrowRight({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
			<path
				d="M3 8h10M9 4l4 4-4 4"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function MenuIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
			<path
				d="M2 4.5h12M2 8h12M2 11.5h12"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
			/>
		</svg>
	);
}

/** Desktop dropdowns sharing one panel that resizes and slides to centre under the open
 * trigger, so moving along the row reads as the panel morphing, not popovers swapping. */
export function MegaMenu({
	groups,
	active,
	variant = "solid",
	itemIcon,
	className,
}: {
	groups: MegaMenuGroup[];
	/** Current path; marks the matching trigger and links current. */
	active?: string;
	variant?: MegaNavbarVariant;
	/** Renders an icon for items without their own, so one function can map a whole menu. */
	itemIcon?: (item: MegaMenuItem) => ReactNode;
	className?: string;
}) {
	const [open, setOpen] = useState(-1);
	const panelId = useId();
	const styles = megaNavbar({ variant });
	const current = currentHref(groupHrefs(groups), active);
	// The notched shelf drops its panel a little further, clearing the wing curve.
	const drop = variant === "notched" ? 10 : 8;
	const [box, setBox] = useState({ width: 0, height: 0, left: 0 });
	const row = useRef<HTMLDivElement>(null);
	const panels = useRef<(HTMLDivElement | null)[]>([]);
	const triggers = useRef<(HTMLButtonElement | null)[]>([]);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	function measure(index: number) {
		const rowEl = row.current;
		const panel = panels.current[index];
		const trigger = triggers.current[index];
		if (!rowEl || !panel || !trigger) return;
		const rowRect = rowEl.getBoundingClientRect();
		const triggerRect = trigger.getBoundingClientRect();
		const width = panel.scrollWidth;
		const ideal = triggerRect.left - rowRect.left + triggerRect.width / 2 - width / 2;
		// Centred under the trigger, but never past the row's start or the window's end.
		const room = window.innerWidth - rowRect.left - width - 8;
		setBox({
			width,
			height: panel.scrollHeight,
			left: Math.max(0, Math.min(ideal, room)),
		});
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: measure left out on purpose, the listed values decide when it runs.
	useEffect(() => {
		if (open < 0) return;
		measure(open);
		const onResize = () => measure(open);
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [open]);

	function cancelClose() {
		if (closeTimer.current) clearTimeout(closeTimer.current);
		closeTimer.current = null;
	}
	function scheduleClose() {
		cancelClose();
		closeTimer.current = setTimeout(() => setOpen(-1), 140);
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: hover region only; the triggers and links inside are the real controls
		<div
			ref={row}
			className={cn(styles.menu(), className)}
			onMouseLeave={scheduleClose}
			onMouseEnter={cancelClose}
		>
			{groups.map((group, index) => {
				const isOpen = open === index;
				return (
					<button
						key={group.label}
						ref={(el) => {
							triggers.current[index] = el;
						}}
						type="button"
						aria-expanded={isOpen}
						aria-controls={panelId}
						onMouseEnter={() => {
							cancelClose();
							setOpen(index);
						}}
						onClick={() => setOpen((current) => (current === index ? -1 : index))}
						onKeyDown={(event) => {
							if (event.key === "Escape") {
								setOpen(-1);
								triggers.current[index]?.focus();
							} else if (event.key === "ArrowDown") {
								event.preventDefault();
								cancelClose();
								setOpen(index);
								// The pane is inert until the open state renders.
								requestAnimationFrame(() =>
									panels.current[index]?.querySelector<HTMLElement>("a")?.focus(),
								);
							}
						}}
						data-current={isCurrentSection(group.href, active)}
						className={styles.trigger({
							current: isOpen || isCurrentSection(group.href, active),
						})}
					>
						{group.label}
						<ChevronDown className={styles.chevron({ open: isOpen })} />
					</button>
				);
			})}

			<div
				id={panelId}
				aria-hidden={open < 0}
				onMouseEnter={cancelClose}
				onMouseLeave={scheduleClose}
				onKeyDown={(event) => {
					if (event.key !== "Escape" || open < 0) return;
					triggers.current[open]?.focus();
					setOpen(-1);
				}}
				className={styles.panel({ open: open >= 0 })}
				style={{
					width: box.width,
					height: box.height,
					transform: `translate3d(${box.left}px, ${open >= 0 ? drop : 2}px, 0) scale(${open >= 0 ? 1 : 0.98})`,
				}}
			>
				{groups.map((group, index) => {
					const isOpen = open === index;
					return (
						<div
							key={group.label}
							ref={(el) => {
								panels.current[index] = el;
							}}
							inert={!isOpen}
							className={styles.pane({ open: isOpen })}
						>
							<ul className={styles.list()}>
								{group.items.map((item) => (
									<li key={item.href}>
										<a
											href={item.href}
											target={item.external ? "_blank" : undefined}
											rel={item.external ? "noreferrer" : undefined}
											onClick={() => setOpen(-1)}
											aria-current={item.href === current ? "page" : undefined}
											className={styles.item()}
										>
											{item.icon || itemIcon ? (
												<span className="mt-0.5 shrink-0 text-muted-foreground [&_svg]:size-4">
													{item.icon ?? itemIcon?.(item)}
												</span>
											) : null}
											<span className="min-w-0">
												<span className="flex items-center gap-1 font-medium text-foreground text-sm">
													{item.label}
													{item.external ? (
														<ArrowUpRight className="size-3 text-muted-foreground" />
													) : null}
												</span>
												{item.description ? (
													<span className="mt-0.5 block text-muted-foreground text-xs">
														{item.description}
													</span>
												) : null}
											</span>
										</a>
									</li>
								))}
							</ul>
							{group.more?.links.length ? (
								<div className={styles.more()}>
									{group.more.heading ? (
										<p className={styles.moreHeading()}>{group.more.heading}</p>
									) : null}
									<ul className={styles.moreList()}>
										{group.more.links.map((link) => (
											<li key={link.href}>
												<a
													href={link.href}
													target={link.external ? "_blank" : undefined}
													rel={link.external ? "noreferrer" : undefined}
													onClick={() => setOpen(-1)}
													aria-current={link.href === current ? "page" : undefined}
													className={styles.moreLink()}
												>
													{link.label}
												</a>
											</li>
										))}
									</ul>
								</div>
							) : null}
							{group.footer ? (
								<a
									href={group.footer.href}
									onClick={() => setOpen(-1)}
									className={styles.footer()}
								>
									<span className="font-medium text-foreground text-sm">
										{group.footer.label}
									</span>
									<span className="flex items-center gap-1.5 text-muted-foreground text-xs">
										{group.footer.hint}
										<ArrowRight className="size-3.5 transition-transform group-hover/cta:translate-x-0.5 motion-reduce:transition-none" />
									</span>
								</a>
							) : null}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function MobileNav({
	open,
	onOpenChange,
	brand,
	groups,
	links,
	actions,
	active,
	variant,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	brand?: ReactNode;
	groups: MegaMenuGroup[];
	links: MegaNavLink[];
	actions?: ReactNode;
	active?: string;
	variant: MegaNavbarVariant;
}) {
	const [openGroup, setOpenGroup] = useState(0);
	const styles = megaNavbar({ variant });
	const current = currentHref(groupHrefs(groups, links), active);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side={variant === "notched" ? "top" : "right"}
				className={styles.sheet()}
			>
				<SheetHeader className="border-border border-b px-5 py-4">
					<SheetTitle className="flex items-center gap-2.5">{brand}</SheetTitle>
				</SheetHeader>
				<nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-3">
					{groups.map((group, index) => {
						const isOpen = openGroup === index;
						return (
							<Collapsible
								key={group.label}
								open={isOpen}
								className="border-border border-b last:border-b-0"
							>
								<button
									type="button"
									aria-expanded={isOpen}
									onClick={() =>
										setOpenGroup((current) => (current === index ? -1 : index))
									}
									className="flex min-h-12 w-full items-center justify-between gap-4 px-2 text-left font-medium text-foreground"
								>
									{group.label}
									<ChevronDown className={styles.mobileChevron({ open: isOpen })} />
								</button>
								<CollapsibleContent className="px-0 pb-2">
									<ul>
										{group.items.map((item) => (
											<li key={item.href}>
												<a
													href={item.href}
													target={item.external ? "_blank" : undefined}
													rel={item.external ? "noreferrer" : undefined}
													onClick={() => onOpenChange(false)}
													aria-current={item.href === current ? "page" : undefined}
													className={styles.mobileItem({
														current: item.href === current,
													})}
												>
													{item.icon ? (
														<span className="shrink-0 text-muted-foreground [&_svg]:size-4">
															{item.icon}
														</span>
													) : null}
													<span className="min-w-0 flex-1">
														<span className="flex items-center gap-1 font-medium text-foreground text-sm">
															{item.label}
															{item.external ? (
																<ArrowUpRight className="size-3 text-muted-foreground" />
															) : null}
														</span>
														{item.description ? (
															<span className="mt-0.5 block text-muted-foreground text-xs">
																{item.description}
															</span>
														) : null}
													</span>
												</a>
											</li>
										))}
									</ul>
								</CollapsibleContent>
							</Collapsible>
						);
					})}
					<ul className="mt-1 pt-1">
						{links.map((link) => (
							<li key={link.href}>
								<a
									href={link.href}
									target={link.external ? "_blank" : undefined}
									rel={link.external ? "noreferrer" : undefined}
									onClick={() => onOpenChange(false)}
									aria-current={link.href === current ? "page" : undefined}
									className={styles.mobileLink({ current: link.href === current })}
								>
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</nav>
				{actions ? (
					<div className="mt-auto flex flex-col gap-2 border-border border-t px-5 py-4">
						{actions}
					</div>
				) : null}
			</SheetContent>
		</Sheet>
	);
}

export interface MegaNavbarProps {
	brand?: ReactNode;
	groups: MegaMenuGroup[];
	links?: MegaNavLink[];
	actions?: ReactNode;
	mobileActions?: ReactNode;
	active?: string;
	sticky?: boolean;
	blur?: boolean;
	variant?: MegaNavbarVariant;
	className?: string;
}

export function MegaNavbar({
	brand,
	groups,
	links = [],
	actions,
	mobileActions,
	active,
	sticky = true,
	blur = true,
	variant = "solid",
	className,
}: MegaNavbarProps) {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		if (!sticky) return;
		const onScroll = () => setScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [sticky]);

	// Navigating from inside the sheet should leave it closed.
	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: active.
	useEffect(() => {
		setMobileOpen(false);
	}, [active]);

	const styles = megaNavbar({
		variant,
		sticky,
		surface: scrolled ? (blur ? "blurred" : "opaque") : "clear",
	});
	const current = currentHref(groupHrefs(groups, links), active);
	const capsule = useRef<HTMLDivElement>(null);
	const pill = useRef<HTMLSpanElement>(null);
	const placePill = (target: EventTarget | null) => {
		if (!capsule.current || !pill.current) return;
		const box = capsuleBox(capsule.current, target);
		Object.assign(pill.current.style, pillStyle(box));
		pill.current.dataset.on = String(Boolean(box));
	};
	// biome-ignore lint/correctness/useExhaustiveDependencies: placePill reads refs; active and variant decide when it reruns.
	useEffect(() => {
		placePill(null);
	}, [active, variant]);

	if (variant === "expand")
		return (
			<MegaNavbarExpand
				brand={brand}
				groups={groups}
				links={links}
				actions={actions}
				mobileActions={mobileActions}
				active={active}
				sticky={sticky}
				surface={scrolled ? (blur ? "blurred" : "opaque") : "clear"}
				className={className}
			/>
		);

	const brandSlot = brand ? (
		<span className="flex shrink-0 items-center gap-2.5 py-1 pr-2">{brand}</span>
	) : null;
	const linkList = (
		<ul className="flex items-center gap-1">
			{links.map((link) => (
				<li key={link.href}>
					<a
						href={link.href}
						target={link.external ? "_blank" : undefined}
						rel={link.external ? "noreferrer" : undefined}
						aria-current={link.href === current ? "page" : undefined}
						data-current={link.href === current}
						className={styles.link({ current: link.href === current })}
					>
						{link.label}
					</a>
				</li>
			))}
		</ul>
	);
	const menuButton = (
		<button
			type="button"
			onClick={() => setMobileOpen(true)}
			aria-expanded={mobileOpen}
			aria-label="Open menu"
			className={styles.menuButton()}
		>
			<MenuIcon className="size-5" />
		</button>
	);

	return (
		<div
			data-slot="mega-navbar"
			data-variant={variant}
			className={cn(styles.root(), className)}
		>
			{variant === "notched" ? (
				<nav aria-label="Primary">
					<div className={styles.shelf()}>
						<NotchedShelf size="lg" fill="text-card">
							<div className={styles.shelfBar()}>
								{brandSlot}
								<MegaMenu
									groups={groups}
									active={active}
									variant={variant}
									className="hidden @3xl:flex"
								/>
								{linkList}
								{actions ? (
									<span className="flex items-center gap-2">{actions}</span>
								) : null}
							</div>
						</NotchedShelf>
					</div>
					<div className={styles.mobileBar()}>
						{brandSlot}
						{menuButton}
					</div>
					<span aria-hidden className={styles.rule()} />
				</nav>
			) : (
				<nav aria-label="Primary" className={styles.nav()}>
					{brandSlot}
					<div className={styles.center()}>
						<div
							ref={capsule}
							className={styles.capsule()}
							onPointerOver={(event) => placePill(event.target)}
							onPointerLeave={() => placePill(null)}
						>
							{variant === "capsule" ? (
								<span ref={pill} aria-hidden className={styles.capsulePill()} />
							) : null}
							<MegaMenu
								groups={groups}
								active={active}
								variant={variant}
								className="hidden @3xl:flex"
							/>
							{linkList}
						</div>
					</div>
					<div className="ml-auto flex shrink-0 items-center gap-2 @3xl:ml-0">
						{actions ? (
							<span className="hidden items-center gap-2 @3xl:flex">{actions}</span>
						) : null}
						{menuButton}
					</div>
				</nav>
			)}

			<MobileNav
				open={mobileOpen}
				onOpenChange={setMobileOpen}
				brand={brand}
				groups={groups}
				links={links}
				actions={mobileActions ?? actions}
				active={active}
				variant={variant}
			/>
		</div>
	);
}
