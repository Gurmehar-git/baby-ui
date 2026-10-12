/** Sample workspace storage for the usage card's meter layout, close to its 50 GB limit. */
export const STORAGE = [
	{ name: "photos", value: 18.4 },
	{ name: "video", value: 14.2 },
	{ name: "documents", value: 12.1 },
	{ name: "other", value: 2.9 },
];

export const STORAGE_CONFIG = {
	photos: { label: "Photos", color: "var(--chart-1)" },
	video: { label: "Video", color: "var(--chart-2)" },
	documents: { label: "Documents", color: "var(--chart-3)" },
	other: { label: "Other", color: "var(--chart-4)" },
};

export const USAGE_METER = {
	title: "Workspace storage",
	description: "Pro plan",
	data: STORAGE,
	config: STORAGE_CONFIG,
	limit: 50,
	unit: "GB",
};
