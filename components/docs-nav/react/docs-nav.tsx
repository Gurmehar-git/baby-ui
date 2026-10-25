"use client";

import {
	type ComponentType,
	type MouseEvent,
	type PointerEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { Badge } from "../../badge/react/badge";
import type { BadgeVariant } from "../../badge/variants";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../../collapsible/react/collapsible";
import { cn } from "../../lib/cn";
import { matchesCurrent } from "../match";
import { revealCurrent } from "../scroll";
import {
	type DocsNavConnector,
	type DocsNavVariant,
	docsNav,
	markerWidth,
	rowState,
} from "../variants";

export type { DocsNavConnector, DocsNavVariant };

export type DocsNavIcon = ComponentType<{
	size?: number;
	className?: string;
	"aria-hidden"?: boolean;
}>;

export interface DocsNavItem {
	href: string;
	label: string;
	/** Additional path prefixes that mark this link current. */
	match?: string[];
	/** Small pill after the label, e.g. a status like "beta". */
	badge?: string;
	/** Badge colour; the Badge default when omitted. */
	badgeVariant?: BadgeVariant;
}

export interface DocsNavSection {
	id: string;
	label: string;
	/** A direct section link. When omitted, the section discloses its items. */
	href?: string;
	/** Additional path prefixes that mark a direct section link current. */
	match?: string[];
	icon?: DocsNavIcon;
	/** Shown beside the section label, e.g. how many links it holds. */
	count?: number | string;
	items?: DocsNavItem[];
}

export interface DocsNavProps {
	sections: DocsNavSection[];
	/** href of the page being viewed; that link is marked current. */
	current?: string;
	/** Ids of the expanded sections. Controlled with onOpenChange. */
	open?: string[];
	/** Uncontrolled starting sections; every section when omitted. */
	defaultOpen?: string[];
	onOpenChange?: (open: string[]) => void;
	variant?: DocsNavVariant;
	connector?: DocsNavConnector;
	/** Adds a continuous hairline ladder beside the links; works with either connector. */
	rungs?: boolean;
	/** Fires on link click, e.g. to close a mobile drawer or route client-side. */
	onNavigate?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
	/** Accessible name of the navigation landmark. */
	label?: string;
	className?: string;
}

/** Documentation sidebar: collapsible sections, a sliding hover pill and a tick or thread curve per link, optionally over a rung ladder. */
export function DocsNav({
	sections,
	current,
	open: openProp,
	defaultOpen,
	onOpenChange,
	variant = "default",
	connector = "tick",
	rungs = false,
	onNavigate,
	label = "Documentation",
	className,
}: DocsNavProps) {
	const [internalOpen, setInternalOpen] = useState(
		() =>
			defaultOpen ??
			sections.filter((section) => !section.href).map((section) => section.id),
	);
	const open = openProp ?? internalOpen;
	const root = useRef<HTMLElement>(null);
	const styles = docsNav({ connector, variant });

	const setSection = (id: string, next: boolean) => {
		const list = next
			? [...open.filter((o) => o !== id), id]
			: open.filter((o) => o !== id);
		if (openProp === undefined) setInternalOpen(list);
		onOpenChange?.(list);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: current/open only retrigger the shared reveal helper.
	useEffect(() => {
		return revealCurrent(root.current);
	}, [current, open]);

	return (
		<nav
			ref={root}
			aria-label={label}
			data-slot="docs-nav"
			className={cn(styles.root(), className)}
		>
			{sections.map((section) => {
				const items = section.items ?? [];
				const href = section.href;
				const sectionCurrent = href
					? matchesCurrent({ href, match: section.match }, current)
					: items.some((item) => matchesCurrent(item, current));
				const sectionStyles = docsNav({ connector, variant, sectionCurrent });
				const Icon = section.icon;
				if (href) {
					return (
						<div key={section.id} className={sectionStyles.section()}>
							<a
								href={href}
								aria-current={sectionCurrent ? "page" : undefined}
								onClick={(event) => onNavigate?.(href, event)}
								className={sectionStyles.topLink()}
							>
								{Icon ? (
									<Icon size={16} aria-hidden className={sectionStyles.sectionIcon()} />
								) : null}
								<span className={sectionStyles.sectionLabel()}>{section.label}</span>
								{section.count !== undefined ? (
									<span className={sectionStyles.count()}>{section.count}</span>
								) : null}
							</a>
						</div>
					);
				}
				return (
					<Collapsible
						key={section.id}
						className={sectionStyles.section()}
						open={open.includes(section.id)}
						onOpenChange={(next) => setSection(section.id, next)}
					>
						<CollapsibleTrigger className={sectionStyles.trigger()}>
							{Icon ? (
								<Icon size={16} aria-hidden className={sectionStyles.sectionIcon()} />
							) : null}
							<span className={sectionStyles.sectionLabel()}>{section.label}</span>
							{section.count !== undefined ? (
								<span className={sectionStyles.count()}>{section.count}</span>
							) : null}
						</CollapsibleTrigger>
						<CollapsibleContent className={sectionStyles.content()}>
							<DocsNavList
								items={items}
								current={current}
								variant={variant}
								connector={connector}
								rungs={rungs}
								onNavigate={onNavigate}
							/>
						</CollapsibleContent>
					</Collapsible>
				);
			})}
		</nav>
	);
}

function DocsNavList({
	items,
	current,
	variant,
	connector,
	rungs,
	onNavigate,
}: {
	items: DocsNavItem[];
	current?: string;
	variant: DocsNavVariant;
	connector: DocsNavConnector;
	rungs: boolean;
	onNavigate?: DocsNavProps["onNavigate"];
}) {
	const list = useRef<HTMLDivElement>(null);
	const [hovered, setHovered] = useState<number | null>(null);
	const [pill, setPill] = useState<{ top: number; height: number } | null>(null);

	const onEnter = (event: PointerEvent<HTMLAnchorElement>, index: number) => {
		if (!list.current) return;
		const row = event.currentTarget.getBoundingClientRect();
		const box = list.current.getBoundingClientRect();
		setHovered(index);
		setPill({ top: row.top - box.top, height: row.height });
	};

	return (
		<div
			ref={list}
			className={docsNav({ connector, variant }).list()}
			onPointerLeave={() => setHovered(null)}
		>
			{pill ? (
				<div
					aria-hidden="true"
					className={docsNav({ connector, variant, hovering: hovered !== null }).pill()}
					style={{ transform: `translateY(${pill.top}px)`, height: pill.height }}
				/>
			) : null}
			{items.map((item, index) => {
				const active = matchesCurrent(item, current);
				const state = rowState(active, hovered === index, hovered !== null);
				const styles = docsNav({ connector, variant, rungs, state });
				return (
					<div key={item.href} className={styles.row()}>
						<span
							aria-hidden="true"
							className={styles.marker()}
							style={{ width: markerWidth(connector, rungs, state) }}
						/>
						{connector === "curve" && index < items.length - 1 ? (
							<span aria-hidden="true" className={styles.rail()} />
						) : null}
						<a
							href={item.href}
							aria-current={active ? "page" : undefined}
							onClick={(event) => onNavigate?.(item.href, event)}
							onPointerEnter={(event) => onEnter(event, index)}
							className={styles.link()}
						>
							<span className={styles.label()}>{item.label}</span>
							{item.badge ? (
								<Badge size="sm" variant={item.badgeVariant} className={styles.badge()}>
									{item.badge}
								</Badge>
							) : null}
						</a>
					</div>
				);
			})}
		</div>
	);
}
