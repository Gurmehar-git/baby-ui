/** Stroke icon paths (24px grid) for the banner demos' badge, floaters and ticker mark. */
export const BANNER_ICONS = {
	badge: ["M12 3 3 7.5l9 4.5 9-4.5L12 3Z", "m3 12 9 4.5 9-4.5", "m3 16.5 9 4.5 9-4.5"],
	floaters: [
		[
			"M14 3v4a1 1 0 0 0 1 1h4",
			"M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z",
			"M9 13h6M9 17h6",
		],
		["M13 3v7h6l-8 11v-7H5l8-11"],
		[
			"M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6Z",
			"M11 16a1 1 0 1 0 2 0 1 1 0 0 0-2 0M8 11V7a4 4 0 1 1 8 0v4",
		],
		["M16 4h4v4M14 10l6-6M8 20H4v-4M4 20l6-6M16 20h4v-4M14 14l6 6M8 4H4v4M4 4l6 6"],
		["M4 20h4L18.5 9.5a2.83 2.83 0 0 0-4-4L4 16v4M13.5 6.5l4 4"],
		["M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3"],
	],
} as const;
