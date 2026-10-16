"use client";

import { Fragment, type ReactNode, useEffect, useId, useRef, useState } from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "../../avatar/react/avatar";
import { Badge } from "../../badge/react/badge";
import type { BadgeVariant } from "../../badge/react/variants";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../../breadcrumb/react/breadcrumb";
import { cn } from "../../lib/react/cn";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import { Tabs, TabsList, TabsTrigger } from "../../tabs/react/tabs";
import { type PageHeaderTab, watchCondensed } from "./header";
import { type PageHeaderVariant, pageHeader } from "./variants";

export type { PageHeaderTab, PageHeaderVariant };

export interface PageHeaderProps {
	title: string;
	/** `sticky` pins the header and condenses it once the page scrolls; `static` scrolls away. */
	variant?: PageHeaderVariant;
	description?: string;
	/** Trail to this page; the last crumb is the current page. */
	breadcrumbs?: { label: string; href?: string }[];
	status?: { label: string; variant?: BadgeVariant };
	/** Faces of the people on this page; four show, the rest count. */
	avatars?: { src: string; alt?: string }[];
	/** Buttons on the right, e.g. a primary action and an overflow menu. */
	actions?: ReactNode;
	tabs?: PageHeaderTab[];
	tab?: string;
	onTabChange?: (tab: string) => void;
	/** Panels under the header, usually one TabsContent per tab. */
	children?: ReactNode;
	className?: string;
}

/** An app page header: breadcrumbs, title with status and people, actions and counted tabs; the sticky variant condenses on scroll. */
export function PageHeader({
	title,
	variant = "static",
	description,
	breadcrumbs = [],
	status,
	avatars = [],
	actions,
	tabs = [],
	tab,
	onTabChange,
	children,
	className,
}: PageHeaderProps) {
	const id = useId();
	const s = pageHeader({ variant });
	const sentinel = useRef<HTMLDivElement>(null);
	const [condensed, setCondensed] = useState(false);
	useEffect(() => {
		const el = sentinel.current;
		if (!el || variant !== "sticky") return;
		return watchCondensed(el, setCondensed);
	}, [variant]);
	const [ownTab, setOwnTab] = useState(tabs[0]?.value ?? "");
	const current = tab ?? ownTab;
	const setTab = (next: string) => {
		if (tab === undefined) setOwnTab(next);
		onTabChange?.(next);
	};

	const bar = (
		<header data-condensed={condensed} className={s.bar()}>
			{breadcrumbs.length ? (
				<div className={s.fold()}>
					<div className={s.foldInner()}>
						<Breadcrumb className={s.crumbs()}>
							<BreadcrumbList>
								{breadcrumbs.map((crumb, index) => (
									<Fragment key={crumb.label}>
										{index > 0 ? <BreadcrumbSeparator /> : null}
										<BreadcrumbItem>
											{index === breadcrumbs.length - 1 || !crumb.href ? (
												<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
											) : (
												<BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
											)}
										</BreadcrumbItem>
									</Fragment>
								))}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</div>
			) : null}
			<div className={s.row()}>
				<div className={s.heading()}>
					<h1 id={`${id}-title`} className={s.title()}>
						{title}
					</h1>
					{status ? (
						<Badge variant={status.variant ?? "secondary"} size="sm">
							{status.label}
						</Badge>
					) : null}
				</div>
				<div className={s.side()}>
					{avatars.length ? (
						<AvatarGroup>
							{avatars.slice(0, 4).map((face) => (
								<Avatar key={face.src} size="sm" className="size-7">
									<AvatarImage src={face.src} alt={face.alt ?? ""} />
									<AvatarFallback>{(face.alt ?? "").charAt(0)}</AvatarFallback>
								</Avatar>
							))}
							{avatars.length > 4 ? (
								<AvatarGroupCount size="sm" className="size-7">
									+{avatars.length - 4}
								</AvatarGroupCount>
							) : null}
						</AvatarGroup>
					) : null}
					{actions}
				</div>
			</div>
			{description ? (
				<div className={s.fold()}>
					<div className={s.foldInner()}>
						<p className={s.description()}>{description}</p>
					</div>
				</div>
			) : null}
			{tabs.length ? (
				<TabsList className={cn(s.tabs(), s.tabList())}>
					{tabs.map((item) => (
						<TabsTrigger key={item.value} value={item.value}>
							{item.label}
							{item.count !== undefined ? (
								<RollingDigits
									value={item.count}
									startOnView={false}
									className={s.tabCount()}
								/>
							) : null}
						</TabsTrigger>
					))}
				</TabsList>
			) : (
				<div className={s.spacer()} />
			)}
		</header>
	);

	return (
		<div
			data-slot="page-header"
			data-variant={variant}
			className={cn(s.root(), className)}
		>
			<div ref={sentinel} aria-hidden="true" className={s.sentinel()} />
			{tabs.length ? (
				<Tabs variant="underline" value={current} onValueChange={setTab}>
					{bar}
					{children ? <div className={s.panels()}>{children}</div> : null}
				</Tabs>
			) : (
				<>
					{bar}
					{children ? <div className={s.panels()}>{children}</div> : null}
				</>
			)}
		</div>
	);
}
