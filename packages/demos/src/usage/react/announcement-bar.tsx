"use client";

import { AnnouncementBar } from "@baby-ui/react";

const messages = [
	{
		id: "launch",
		message: "Version 2.0 is out.",
		action: { label: "See what's new", href: "/changelog" },
	},
];

export function Example() {
	return <AnnouncementBar id="launch-2-0" messages={messages} />;
}
