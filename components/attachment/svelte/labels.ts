import type { AttachmentStatus } from "./variants";

/** Every visible or announced string, overridable for other languages. */
export type AttachmentLabels = Record<AttachmentStatus | "remove" | "retry", string>;

export const ATTACHMENT_LABELS: AttachmentLabels = {
	uploading: "Uploading",
	ready: "Ready",
	error: "Upload failed",
	remove: "Remove",
	retry: "Retry",
};
