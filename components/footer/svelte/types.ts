import type { Snippet } from "svelte";

export type FooterLink = {
	label: string;
	href: string;
	external?: boolean;
	/** A second muted line under the label, e.g. a product's kind. */
	description?: string;
};
export type FooterColumn = { title: string; links: FooterLink[] };
/** `icon` draws the square icon button; without one the label shows as text. */
export type FooterSocialLink = { icon?: Snippet; href: string; label: string };
export type FooterStatus = {
	label: string;
	href?: string;
	tone?: "success" | "warning" | "destructive";
};
