import { getContext, hasContext, setContext } from "svelte";
import type { AttachmentLabels } from "./labels";
import type { AttachmentStatus, AttachmentVariant } from "./variants";

export type AttachmentState = {
	name: string;
	status: AttachmentStatus;
	progress: number;
	variant: AttachmentVariant;
	labels: AttachmentLabels;
	leaving: boolean;
	leave: (then?: () => void) => void;
};

const KEY = Symbol("attachment");
const LIST = Symbol("attachments");

/** The root's state behind getters, so every part reads the latest value. */
export const setAttachment = (state: AttachmentState) => setContext(KEY, state);
export function attachmentState(part: string): AttachmentState {
	if (!hasContext(KEY)) throw new Error(`${part} must be used inside <Attachment>`);
	return getContext<AttachmentState>(KEY);
}

// Set by Attachments, so a lone Attachment is not an orphaned listitem.
export const markAttachmentList = () => setContext(LIST, true);
export const inAttachmentList = () => hasContext(LIST);
