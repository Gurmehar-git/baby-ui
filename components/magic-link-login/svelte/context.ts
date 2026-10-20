import { getContext, hasContext, setContext } from "svelte";
import type { MagicLinkLabels, MagicLinkStatus } from "../magic-link-core";
import type { magicLinkLogin } from "../variants";

export type MagicLinkView = "form" | "sent";

export type MagicLinkLoginState = {
	inputId: string;
	errorId: string;
	status: MagicLinkStatus;
	view: MagicLinkView;
	email: string;
	setEmail: (next: string) => void;
	address: string;
	setInvalid: (next: boolean) => void;
	/** The invalid-email or server message, if any. */
	message?: string;
	cooldown: number;
	/** The sent view's heading registers here so the root can focus it. */
	setSentHeading: (el: HTMLElement | undefined) => void;
	labels: MagicLinkLabels;
	styles: ReturnType<typeof magicLinkLogin>;
};

const KEY = Symbol("magic-link-login");

/** The root's state behind getters, so every part reads the latest value. */
export const setMagicLinkLogin = (state: MagicLinkLoginState) => setContext(KEY, state);
export function magicLinkLoginState(part: string): MagicLinkLoginState {
	if (!hasContext(KEY)) throw new Error(`${part} must be used inside <MagicLinkLogin>`);
	return getContext<MagicLinkLoginState>(KEY);
}
