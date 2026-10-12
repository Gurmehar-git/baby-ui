"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";
import { cn } from "../lib/cn";
import { SIDEBAR_NAV_LABELS, type SidebarNavLabels } from "./labels";
import { type SidebarNavSize, sidebarNav } from "./variants";

export type { SidebarNavSize };

export type SidebarNavItem = {
	key: string;
	label: string;
	icon?: ReactNode;
	count?: string;
};
export type SidebarRecent = { id: string; label: string; prompt?: string };
export type SidebarWorkspace = {
	name: string;
	monogram: string;
	/** Workspace image URL; the monogram shows while it loads or if it fails. */
	image?: string;
};
export type SidebarWorkspaceAction = {
	label: string;
	icon?: ReactNode;
	onSelect?: () => void;
};

function ChevronDownIcon() {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
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

function CollapseIcon() {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4.5">
			<rect
				x="2"
				y="3"
				width="12"
				height="10"
				rx="2"
				stroke="currentColor"
				strokeWidth="1.4"
			/>
			<path d="M6 3v10" stroke="currentColor" strokeWidth="1.4" />
			<path
				d="M4.5 8h-1M4 6.5 3 8l1 1.5"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function SearchIcon() {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
			<circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
			<path
				d="m13 13-2.5-2.5"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function CrossIcon() {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
			<path
				d="m4 4 8 8M12 4l-8 8"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function CheckIcon() {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
			<path
				d="M3.5 8.4 6.2 11 12.5 4.5"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function GlideList({ children, className }: { children: ReactNode; className?: string }) {
	const [box, setBox] = useState<{ top: number; height: number } | null>(null);
	const [visible, setVisible] = useState(false);

	function onOver(event: React.MouseEvent<HTMLDivElement>) {
		const row = (event.target as Element).closest<HTMLElement>("[data-row]");
		if (!row) return;
		setBox({ top: row.offsetTop, height: row.offsetHeight });
		setVisible(true);
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: hover-glide highlight; the row buttons carry real interaction
		// biome-ignore lint/a11y/useKeyWithMouseEvents: decorative pointer-only highlight, not a control
		<div
			className={cn("relative flex flex-col gap-px", className)}
			onMouseOver={onOver}
			onMouseLeave={() => setVisible(false)}
		>
			<span
				aria-hidden
				className="pointer-events-none absolute inset-x-0 rounded-lg bg-foreground/[0.06] top-0 transition-[transform,height,opacity] duration-(--duration-fast) ease-[var(--ease-ui-out)] motion-reduce:transition-none"
				style={{
					transform: `translateY(${box?.top ?? 0}px)`,
					height: box?.height ?? 0,
					opacity: visible ? 1 : 0,
				}}
			/>
			{children}
		</div>
	);
}

function RailButton({
	icon,
	label,
	active = false,
	count,
	onClick,
	collapsed,
}: {
	icon: ReactNode;
	label: string;
	active?: boolean;
	count?: string;
	onClick?: () => void;
	collapsed: boolean;
}) {
	return (
		<button
			data-row
			type="button"
			onClick={onClick}
			aria-current={active ? "page" : undefined}
			title={collapsed ? label : undefined}
			className={cn(
				"relative z-10 mx-2 flex h-8 items-center rounded-lg px-2 text-left transition-[background-color,transform] duration-(--duration-fast) active:scale-[0.98]",
				active && "bg-foreground/[0.06]",
			)}
		>
			<span
				className={cn(
					"flex size-5 shrink-0 items-center justify-center",
					active ? "text-foreground" : "text-muted-foreground",
				)}
			>
				{icon}
			</span>
			<span
				className={cn(
					"ml-1.5 min-w-0 flex-1 truncate text-sm font-medium transition-[opacity,transform] duration-(--duration-fast) motion-reduce:transition-none",
					active ? "text-foreground" : "text-muted-foreground",
					collapsed && "translate-x-2 opacity-0",
				)}
			>
				{label}
			</span>
			{count ? (
				<span
					className={cn(
						"mr-2 shrink-0 text-xs font-medium text-muted-foreground tabular-nums transition-opacity duration-(--duration-fast) motion-reduce:transition-none",
						collapsed && "opacity-0",
					)}
				>
					{count}
				</span>
			) : null}
		</button>
	);
}

export interface SidebarNavProps {
	workspace: SidebarWorkspace;
	logo?: ReactNode;
	navItems: SidebarNavItem[];
	recents: SidebarRecent[];
	workspaceActions?: SidebarWorkspaceAction[];
	onSignOut?: () => void;
	size?: SidebarNavSize;
	collapsed?: boolean;
	defaultCollapsed?: boolean;
	onCollapsedChange?: (collapsed: boolean) => void;
	activeNav?: string;
	/** Defaults to the first nav item. */
	defaultActiveNav?: string;
	onNavigate?: (key: string) => void;
	activeTitle?: string | null;
	defaultActiveTitle?: string | null;
	onPick?: (id: string, label: string, prompt?: string) => void;
	/** Nav key that picking a recent or starting a new chat activates; defaults to the first nav item. */
	chatNavKey?: string;
	newChatLabel?: string;
	newChatIcon?: ReactNode;
	onNewChat?: () => void;
	/** The footer button renders only when `onFooterClick` is passed. */
	footerLabel?: string;
	footerIcon?: ReactNode;
	onFooterClick?: () => void;
	fill?: boolean;
	/** Every built-in string, for localisation. */
	labels?: Partial<SidebarNavLabels>;
	className?: string;
}

/** A collapsible workspace sidebar: a workspace switcher, primary nav, searchable recents,
 * and a footer action. Collapsing keeps every icon aligned, fading only the labels. */
export function SidebarNav({
	workspace,
	logo,
	navItems,
	recents,
	workspaceActions = [],
	onSignOut,
	size = "default",
	collapsed,
	defaultCollapsed = false,
	onCollapsedChange,
	activeNav,
	defaultActiveNav,
	onNavigate,
	activeTitle,
	defaultActiveTitle = null,
	onPick,
	chatNavKey,
	newChatLabel = "New chat",
	newChatIcon,
	onNewChat,
	footerLabel,
	footerIcon,
	onFooterClick,
	fill = false,
	labels: labelsProp,
	className,
}: SidebarNavProps) {
	const labels = { ...SIDEBAR_NAV_LABELS, ...labelsProp };
	const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
	const [internalNav, setInternalNav] = useState(defaultActiveNav ?? navItems[0]?.key);
	const [internalTitle, setInternalTitle] = useState(defaultActiveTitle);
	const [searchOpen, setSearchOpen] = useState(false);
	const [recentsOpen, setRecentsOpen] = useState(true);
	const [query, setQuery] = useState("");
	const searchRef = useRef<HTMLInputElement>(null);

	const isCollapsed = collapsed ?? internalCollapsed;
	const currentNav = activeNav ?? internalNav;
	const chatKey = chatNavKey ?? navItems[0]?.key;
	const trimmed = query.trim().toLowerCase();
	const currentTitle = activeTitle ?? internalTitle;
	const matches = (item: SidebarRecent) => item.label.toLowerCase().includes(trimmed);
	const matchCount = recents.filter(matches).length;

	function setCollapsed(next: boolean) {
		if (collapsed === undefined) setInternalCollapsed(next);
		onCollapsedChange?.(next);
		if (next) {
			setSearchOpen(false);
			setQuery("");
		}
	}

	function selectNav(key: string | undefined) {
		if (key === undefined) return;
		if (activeNav === undefined) setInternalNav(key);
		onNavigate?.(key);
	}

	function pick(item: SidebarRecent) {
		selectNav(chatKey);
		if (activeTitle === undefined) setInternalTitle(item.label);
		onPick?.(item.id, item.label, item.prompt);
	}

	return (
		<aside
			data-slot="sidebar-nav"
			aria-label={labels.navigation}
			className={cn(
				"relative flex shrink-0 overflow-hidden transition-[width] duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
				fill ? "h-full" : "h-[600px]",
				isCollapsed ? "w-13" : sidebarNav({ size }),
				className,
			)}
		>
			<div className={cn("flex min-h-0 shrink-0 flex-col", sidebarNav({ size }))}>
				<div className="relative mb-2.5 h-10 shrink-0">
					<DropdownMenu>
						<DropdownMenuTrigger
							aria-hidden={isCollapsed}
							tabIndex={isCollapsed ? -1 : 0}
							className="absolute top-1 right-12 left-2 flex h-8 items-center rounded-lg px-2 text-left transition-[background-color,transform] duration-(--duration-instant) hover:bg-accent active:scale-[0.99]"
						>
							<span
								className={cn(
									"flex size-5 shrink-0 items-center justify-center text-foreground transition-opacity duration-(--duration-fast)",
									isCollapsed && "opacity-0",
								)}
							>
								{logo ?? (
									<Avatar
										aria-hidden
										shape="square"
										className="size-5 rounded-[5px] bg-foreground font-semibold text-xs"
									>
										<AvatarImage src={workspace.image} alt="" />
										<AvatarFallback className="text-background">
											{workspace.monogram}
										</AvatarFallback>
									</Avatar>
								)}
							</span>
							<span
								className={cn(
									"ml-1.5 min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground transition-[opacity,transform] duration-(--duration-fast) motion-reduce:transition-none",
									isCollapsed && "translate-x-2 opacity-0",
								)}
							>
								{workspace.name}
							</span>
							<span
								className={cn(
									"ml-1 flex shrink-0 text-muted-foreground transition-opacity duration-(--duration-fast)",
									isCollapsed && "opacity-0",
								)}
							>
								<ChevronDownIcon />
							</span>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-64">
							<DropdownMenuItem className="h-10 gap-1.5">
								<Avatar
									aria-hidden
									shape="square"
									className="size-6 rounded-md bg-foreground font-semibold text-xs"
								>
									<AvatarImage src={workspace.image} alt="" />
									<AvatarFallback className="text-background">
										{workspace.monogram}
									</AvatarFallback>
								</Avatar>
								<span className="min-w-0 flex-1 truncate font-medium text-sm text-foreground">
									{workspace.name}
								</span>
								<span className="shrink-0 text-foreground">
									<CheckIcon />
								</span>
							</DropdownMenuItem>
							{workspaceActions.length > 0 ? (
								<>
									<DropdownMenuSeparator />
									{workspaceActions.map((action) => (
										<DropdownMenuItem
											key={action.label}
											onClick={action.onSelect}
											disabled={!action.onSelect}
											className="h-9 gap-1.5"
										>
											{action.icon ? (
												<span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
													{action.icon}
												</span>
											) : null}
											<span className="min-w-0 flex-1 truncate text-sm">
												{action.label}
											</span>
										</DropdownMenuItem>
									))}
								</>
							) : null}
							{onSignOut ? (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={onSignOut} className="h-9 gap-1.5">
										<span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
											<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
												<path
													d="M6 3H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2M11 11l3-3-3-3M14 8H6"
													stroke="currentColor"
													strokeWidth="1.4"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</span>
										<span className="min-w-0 flex-1 truncate text-sm">
											{labels.signOut}
										</span>
									</DropdownMenuItem>
								</>
							) : null}
						</DropdownMenuContent>
					</DropdownMenu>

					<button
						type="button"
						aria-label={labels.collapse}
						aria-hidden={isCollapsed}
						tabIndex={isCollapsed ? -1 : 0}
						onClick={() => setCollapsed(true)}
						className={cn(
							"absolute top-1 right-2 flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-[opacity,background-color,color] duration-(--duration-fast) hover:bg-accent hover:text-accent-foreground",
							isCollapsed && "pointer-events-none opacity-0",
						)}
					>
						<CollapseIcon />
					</button>
					<button
						type="button"
						aria-label={labels.expand}
						aria-hidden={!isCollapsed}
						tabIndex={isCollapsed ? 0 : -1}
						onClick={() => setCollapsed(false)}
						className={cn(
							"absolute top-0.5 left-2 flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-[opacity,background-color,color] duration-(--duration-fast) hover:bg-accent hover:text-accent-foreground",
							!isCollapsed && "pointer-events-none opacity-0",
						)}
					>
						<CollapseIcon />
					</button>
				</div>

				<GlideList>
					<RailButton
						icon={newChatIcon}
						label={newChatLabel}
						collapsed={isCollapsed}
						onClick={() => {
							if (activeTitle === undefined) setInternalTitle(null);
							selectNav(chatKey);
							onNewChat?.();
						}}
					/>
					{navItems.map((item) => (
						<RailButton
							key={item.key}
							icon={item.icon}
							label={item.label}
							count={item.count}
							active={currentNav === item.key}
							collapsed={isCollapsed}
							onClick={() => selectNav(item.key)}
						/>
					))}
				</GlideList>

				<div className="mt-3 min-h-0 flex-1 overflow-y-auto">
					<div
						className={cn(
							"relative mx-2 mb-1 h-8 transition-opacity duration-(--duration-fast)",
							isCollapsed && "opacity-0",
						)}
						inert={isCollapsed}
					>
						<button
							type="button"
							aria-expanded={recentsOpen}
							aria-hidden={searchOpen}
							tabIndex={searchOpen ? -1 : 0}
							onClick={() => setRecentsOpen((open) => !open)}
							className={cn(
								"absolute inset-0 flex items-center gap-1.5 rounded-lg px-2 font-medium text-xs text-muted-foreground transition-[opacity,transform,background-color] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] hover:bg-accent",
								searchOpen
									? "pointer-events-none -translate-x-1 opacity-0"
									: "translate-x-0 opacity-100",
							)}
						>
							<span
								className="shrink-0 transition-transform duration-(--duration-fast) motion-reduce:transition-none"
								style={{ transform: recentsOpen ? undefined : "rotate(-90deg)" }}
							>
								<ChevronDownIcon />
							</span>
							<span>{labels.recents}</span>
						</button>

						<button
							type="button"
							aria-label={labels.search}
							aria-expanded={searchOpen}
							onClick={() => {
								setSearchOpen(true);
								searchRef.current?.focus();
							}}
							className={cn(
								"absolute top-0 right-0 z-10 flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-[opacity,background-color,color,transform] duration-[var(--duration-dropdown)] hover:bg-accent hover:text-accent-foreground active:scale-[0.96]",
								searchOpen ? "pointer-events-none opacity-0" : "opacity-100",
							)}
						>
							<SearchIcon />
						</button>

						<div
							className={cn(
								"absolute top-0 right-0 z-20 flex h-8 items-center overflow-hidden rounded-lg bg-muted text-muted-foreground shadow-xs transition-[width,opacity] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] focus-within:text-foreground",
								searchOpen
									? "pointer-events-auto opacity-100"
									: "pointer-events-none opacity-0",
							)}
							style={{ width: searchOpen ? "100%" : 28 }}
						>
							<span className="ml-2 flex shrink-0 items-center justify-center">
								<SearchIcon />
							</span>
							<input
								ref={searchRef}
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								onKeyDown={(event) => {
									if (event.key === "Escape") {
										setSearchOpen(false);
										setQuery("");
									}
								}}
								placeholder={labels.search}
								aria-label={labels.searchInput}
								className="ml-1.5 min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
							/>
							<button
								type="button"
								aria-label={labels.closeSearch}
								onClick={() => {
									setSearchOpen(false);
									setQuery("");
								}}
								className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] duration-(--duration-fast) hover:bg-accent hover:text-accent-foreground active:scale-[0.96]"
							>
								<CrossIcon />
							</button>
						</div>
					</div>

					<div
						className={cn(
							"grid transition-[grid-template-rows,opacity] duration-(--duration-base) ease-[var(--ease-ui-out)] motion-reduce:transition-none",
							isCollapsed && "opacity-0",
						)}
						style={{ gridTemplateRows: recentsOpen ? "1fr" : "0fr" }}
						inert={isCollapsed || !recentsOpen}
					>
						<div className="overflow-hidden">
							<GlideList className="gap-0">
								{recents.map((item) => {
									const active = item.label === currentTitle;
									const shown = matches(item);
									return (
										<div
											key={item.id}
											className="grid transition-[grid-template-rows,opacity] duration-(--duration-base) ease-[var(--ease-ui-out)] motion-reduce:transition-none"
											style={{
												gridTemplateRows: shown ? "1fr" : "0fr",
												opacity: shown ? 1 : 0,
											}}
											inert={!shown}
										>
											<div className="overflow-hidden">
												<button
													data-row
													type="button"
													title={item.label}
													onClick={() => pick(item)}
													className={cn(
														"relative z-10 mx-2 mb-px flex h-8 items-center rounded-lg px-2 text-left transition-[background-color,transform] duration-(--duration-fast) active:scale-[0.98]",
														active && "bg-foreground/[0.06]",
													)}
												>
													<span
														className={cn(
															"min-w-0 flex-1 truncate text-sm font-medium",
															active ? "text-foreground" : "text-muted-foreground",
														)}
													>
														{item.label}
													</span>
												</button>
											</div>
										</div>
									);
								})}
								{query && matchCount === 0 ? (
									<div className="mx-2 px-2 py-2 text-xs text-muted-foreground">
										{labels.noResults}
									</div>
								) : null}
							</GlideList>
						</div>
					</div>
				</div>

				{onFooterClick ? (
					<div
						className={cn(
							"mx-2 mt-3 border-border border-t pt-3 transition-opacity duration-(--duration-fast) motion-reduce:transition-none",
							isCollapsed && "opacity-0",
						)}
						inert={isCollapsed}
					>
						<button
							type="button"
							onClick={onFooterClick}
							className="flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-foreground/[0.06] font-medium text-xs text-foreground transition-[background-color,transform] duration-(--duration-fast) hover:bg-foreground/[0.1] active:scale-[0.98]"
						>
							{footerIcon}
							{footerLabel}
						</button>
					</div>
				) : null}
			</div>
		</aside>
	);
}
