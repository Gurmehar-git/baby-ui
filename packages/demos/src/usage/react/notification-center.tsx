"use client";

import { NotificationCenter, type NotificationItem } from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [items, setItems] = useState<NotificationItem[]>([
		{ id: "1", title: "Deploy finished", time: "2m", tone: "success" },
	]);
	return <NotificationCenter notifications={items} onNotificationsChange={setItems} />;
}
