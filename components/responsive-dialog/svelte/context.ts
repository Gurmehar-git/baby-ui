import { createContext } from "svelte";
import type { DialogVariant } from "../../dialog/svelte/context";

export type { DialogVariant as ResponsiveDialogVariant } from "../../dialog/svelte/context";

export type ResponsiveDialogContext = {
	readonly isMobile: boolean;
	readonly variant: DialogVariant;
};

export const [getResponsiveDialog, setResponsiveDialog] =
	createContext<ResponsiveDialogContext>();
