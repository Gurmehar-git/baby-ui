/** Sample data for the file-upload, number-input and multi-select demos. */
import type { UploadFile } from "../../../../components/file-upload/core";

export const TEAM_MEMBERS = [
	{ value: "ana", label: "Ana Ruiz", keywords: "design" },
	{ value: "ben", label: "Ben Okafor", keywords: "engineering" },
	{ value: "chloe", label: "Chloé Martin", keywords: "product" },
	{ value: "dev", label: "Dev Patel", keywords: "engineering" },
	{ value: "emi", label: "Emi Sato", keywords: "research" },
	{ value: "finn", label: "Finn Larsen", keywords: "support", disabled: true },
];

/** Fakes an upload in demos only: real apps report progress from their own request. */
export const UPLOAD_TICK_MS = 180;
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

const sample = (name: string, bytes: number, type: string) =>
	new File([new Uint8Array(bytes)], name, { type });

/** Rows the demo opens with, one per settled state; the queued one starts uploading on mount. */
export function sampleUploads(): UploadFile[] {
	return [
		{
			id: "brief",
			file: sample("launch-brief.pdf", 248_000, "application/pdf"),
			progress: 100,
			status: "done",
		},
		{
			id: "export",
			file: sample("q3-export.csv", 1_400_000, "text/csv"),
			progress: 100,
			status: "error",
			error: "Network error",
		},
		{
			id: "deck",
			file: sample("pitch-deck.pdf", 3_100_000, "application/pdf"),
			progress: 0,
			status: "queued",
		},
	];
}
