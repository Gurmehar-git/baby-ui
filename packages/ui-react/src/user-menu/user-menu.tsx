"use client";

import { type ReactNode, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar";
import { Badge } from "../badge/badge";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";
import { cn } from "../lib/cn";
import { initials } from "../mention-input/mention";
import { Spinner } from "../spinner/spinner";
import {
	runSignOut,
	statusLabel,
	THEME_OPTIONS,
	type ThemePreference,
	USER_STATUSES,
	type UserMenuUser,
	type UserStatus,
} from "./account";
import { type UserMenuSize, userMenu } from "./variants";

export type { ThemePreference, UserMenuSize, UserMenuUser, UserStatus };

export type UserMenuItem = {
	label: string;
	icon?: ReactNode;
	/** Shortcut hint such as "⌘,"; the key is not bound. */
	shortcut?: string;
	onSelect?: () => void;
};

export interface UserMenuProps {
	user: UserMenuUser;
	/** Passing `status` or `onStatusChange` shows the presence dot and a status submenu. */
	status?: UserStatus;
	onStatusChange?: (status: UserStatus) => void;
	/** Passing `theme` or `onThemeChange` shows a theme submenu; applying it is up to the app. */
	theme?: ThemePreference;
	onThemeChange?: (theme: ThemePreference) => void;
	/** Account destinations; keep it to three or four. */
	items?: UserMenuItem[];
	/** A returned promise keeps the menu open with progress until it settles. */
	onSignOut?: () => unknown;
	signOutShortcut?: string;
	/** Shows the name and a chevron beside the avatar from 640px up. */
	showName?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	align?: "start" | "center" | "end";
	size?: UserMenuSize;
	className?: string;
}

const Glyph = ({ d }: { d: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.75"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden
		className="size-4 text-muted-foreground"
	>
		<path d={d} />
	</svg>
);

/** The account menu behind a person's avatar: identity, destinations, status, theme and sign out. */
export function UserMenu({
	user,
	status,
	onStatusChange,
	theme,
	onThemeChange,
	items = [],
	onSignOut,
	signOutShortcut,
	showName = false,
	open,
	onOpenChange,
	align = "end",
	size = "default",
	className,
}: UserMenuProps) {
	const [ownOpen, setOwnOpen] = useState(false);
	const isOpen = open ?? ownOpen;
	const [pending, setPending] = useState(false);
	const s = userMenu({ size });
	const showStatus = status !== undefined || onStatusChange !== undefined;
	const showTheme = theme !== undefined || onThemeChange !== undefined;
	const setOpen = (next: boolean) => {
		if (open === undefined) setOwnOpen(next);
		onOpenChange?.(next);
	};
	const face = (
		<span className={s.face()}>
			<Avatar>
				{user.avatar && <AvatarImage src={user.avatar} alt="" />}
				<AvatarFallback>{initials(user.name)}</AvatarFallback>
			</Avatar>
			{showStatus && status && (
				<span aria-hidden data-presence={status} className={s.dot()} />
			)}
		</span>
	);

	return (
		<DropdownMenu open={isOpen} onOpenChange={(next) => !pending && setOpen(next)}>
			<DropdownMenuTrigger
				aria-label={`Account menu for ${user.name}${showStatus && status ? `, ${statusLabel(status)}` : ""}`}
				className={cn(s.trigger(), className)}
			>
				{face}
				{showName && (
					<>
						<span className={s.name()}>{user.name}</span>
						<svg viewBox="0 0 16 16" fill="none" aria-hidden className={s.chevron()}>
							<path
								d="m4 6 4 4 4-4"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align={align} className={s.content()}>
				<DropdownMenuLabel className={s.header()}>
					{face}
					<span className={s.identity()}>
						<span className={s.headerName()}>
							<span className="truncate">{user.name}</span>
							{user.plan && (
								<Badge size="sm" variant="secondary">
									{user.plan}
								</Badge>
							)}
						</span>
						<span className={s.email()}>{user.email}</span>
					</span>
				</DropdownMenuLabel>
				{(showStatus || showTheme || items.length > 0) && <DropdownMenuSeparator />}
				{showStatus && (
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<span className="flex items-center gap-2">
								Status
								{status && <span className={s.value()}>{statusLabel(status)}</span>}
							</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							{USER_STATUSES.map((option) => (
								<DropdownMenuCheckboxItem
									key={option.value}
									checked={status === option.value}
									onCheckedChange={() => onStatusChange?.(option.value)}
								>
									<span
										aria-hidden
										data-presence={option.value}
										className={cn(s.dot(), "relative inset-auto mr-1 ring-0")}
									/>
									{option.label}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				)}
				{showTheme && (
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<span className="flex items-center gap-2">
								Theme
								{theme && (
									<span className={s.value()}>
										{THEME_OPTIONS.find((option) => option.value === theme)?.label}
									</span>
								)}
							</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							{THEME_OPTIONS.map((option) => (
								<DropdownMenuCheckboxItem
									key={option.value}
									checked={theme === option.value}
									onCheckedChange={() => onThemeChange?.(option.value)}
								>
									<Glyph d={option.icon} />
									{option.label}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				)}
				{items.map((item) => (
					<DropdownMenuItem key={item.label} onClick={item.onSelect}>
						{item.icon}
						{item.label}
						{item.shortcut && (
							<DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
						)}
					</DropdownMenuItem>
				))}
				{onSignOut && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							closeOnClick={false}
							aria-disabled={pending || undefined}
							onClick={() => {
								if (pending) return;
								runSignOut(onSignOut, setPending).then(() => setOpen(false));
							}}
						>
							{pending ? (
								<Spinner size="sm" />
							) : (
								<Glyph d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9" />
							)}
							{pending ? "Signing out…" : "Sign out"}
							{signOutShortcut && !pending && (
								<DropdownMenuShortcut>{signOutShortcut}</DropdownMenuShortcut>
							)}
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
