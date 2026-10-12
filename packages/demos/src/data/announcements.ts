const DAY = 86_400_000;

/** Rotating site announcements; the sale ends a few days after the demo loads. */
export const announcementsAt = (now: number) => [
	{
		id: "launch",
		message: "Baby UI 2.0 is here, with 40 new components.",
		action: { label: "Read the changelog", href: "#changelog" },
	},
	{
		id: "sale",
		message: "Launch week: 30% off Pro.",
		countdown: { to: now + 3 * DAY + 5 * 3_600_000, label: "Ends in" },
		action: { label: "Upgrade", href: "#pricing" },
	},
	{ id: "webinar", message: "Live workshop on motion design, Thursday at 5pm UTC." },
];
