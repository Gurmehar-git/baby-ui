"use client";

import {
	type ComponentProps,
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import { TabsList } from "../../tabs/react/tabs";
import { watchCondensed } from "../header";
import { type PageHeaderVariant, pageHeader } from "../variants";

export type { PageHeaderVariant };

const CondensedContext = createContext(false);

/**
 * An app page header from parts: breadcrumbs, title, actions and tabs. The sticky variant pins
 * the bar and condenses it once the page scrolls; wrap the parts in Tabs to give it panels.
 */
export function PageHeader({
	variant = "static",
	className,
	children,
	...props
}: ComponentProps<"div"> & { variant?: PageHeaderVariant }) {
	const sentinel = useRef<HTMLDivElement>(null);
	const [condensed, setCondensed] = useState(false);
	useEffect(() => {
		const el = sentinel.current;
		if (!el || variant !== "sticky") return;
		return watchCondensed(el, setCondensed);
	}, [variant]);
	return (
		<CondensedContext.Provider value={condensed}>
			<div
				data-slot="page-header"
				data-variant={variant}
				className={cn(pageHeader({ variant }).root(), className)}
				{...props}
			>
				<div ref={sentinel} aria-hidden="true" className={pageHeader().sentinel()} />
				{children}
			</div>
		</CondensedContext.Provider>
	);
}

/** The header itself; pinned and condensing when the root is `sticky`. */
export function PageHeaderBar({ className, ...props }: ComponentProps<"header">) {
	const condensed = useContext(CondensedContext);
	return (
		<header
			data-slot="page-header-bar"
			data-condensed={condensed}
			className={cn(pageHeader().bar(), className)}
			{...props}
		/>
	);
}

function Fold({
	slot,
	className,
	children,
	...props
}: ComponentProps<"div"> & { slot: string }) {
	const s = pageHeader();
	return (
		<div data-slot={slot} className={cn(s.fold(), className)} {...props}>
			<div className={s.foldInner()}>{children}</div>
		</div>
	);
}

/** Holds a Breadcrumb; folds away while the bar is condensed. */
export function PageHeaderBreadcrumbs({ className, ...props }: ComponentProps<"div">) {
	return (
		<Fold
			slot="page-header-breadcrumbs"
			className={cn(pageHeader().crumbs(), className)}
			{...props}
		/>
	);
}

export function PageHeaderRow({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="page-header-row"
			className={cn(pageHeader().row(), className)}
			{...props}
		/>
	);
}

/** The title and whatever sits beside it, such as a status Badge. */
export function PageHeaderHeading({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="page-header-heading"
			className={cn(pageHeader().heading(), className)}
			{...props}
		/>
	);
}

export function PageHeaderTitle({ className, ...props }: ComponentProps<"h1">) {
	return (
		<h1
			data-slot="page-header-title"
			className={cn(pageHeader().title(), className)}
			{...props}
		/>
	);
}

/** Buttons and an AvatarGroup on the right of the title row. */
export function PageHeaderActions({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="page-header-actions"
			className={cn(pageHeader().side(), className)}
			{...props}
		/>
	);
}

/** One line under the title; folds away while the bar is condensed. */
export function PageHeaderDescription({
	className,
	children,
	...props
}: ComponentProps<"div">) {
	return (
		<Fold slot="page-header-description" {...props}>
			<p className={cn(pageHeader().description(), className)}>{children}</p>
		</Fold>
	);
}

/** The TabsList under the title; holds TabsTriggers inside a Tabs root. */
export function PageHeaderTabs({ className, ...props }: ComponentProps<typeof TabsList>) {
	const s = pageHeader();
	return (
		<TabsList
			data-slot="page-header-tabs"
			className={cn(s.tabs(), s.tabList(), className)}
			{...props}
		/>
	);
}

/** A count inside a tab trigger that rolls to each new value. */
export function PageHeaderTabCount({
	value,
	className,
}: {
	value: number;
	className?: string;
}) {
	return (
		<RollingDigits
			value={value}
			startOnView={false}
			className={cn(pageHeader().tabCount(), className)}
		/>
	);
}

/** The page under the header, usually one TabsContent per tab. */
export function PageHeaderContent({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="page-header-content"
			className={cn(pageHeader().panels(), className)}
			{...props}
		/>
	);
}
