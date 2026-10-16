import type { Snippet } from "svelte";

export type SidebarNavItem = {
	key: string;
	label: string;
	icon?: Snippet;
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
	icon?: Snippet;
	onSelect?: () => void;
};
