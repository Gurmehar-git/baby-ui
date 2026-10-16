import type { Snippet } from "svelte";

export type ComposerModel = {
	value: string;
	label: string;
	icon?: Snippet;
	disabled?: boolean;
};

export type ComposerAction = {
	value: string;
	label: string;
	description?: string;
	icon?: Snippet;
	disabled?: boolean;
};
