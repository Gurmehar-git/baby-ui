"use client";

import { NotificationCenter } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { NOTIFICATIONS } from "../data/notifications";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function NotificationCenterDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof NotificationCenter>>(props);
	const [notifications, setNotifications] = useState(NOTIFICATIONS);
	return (
		<div className="grid min-h-24 place-items-center">
			<NotificationCenter
				notifications={notifications}
				onNotificationsChange={setNotifications}
				size={p.size}
			/>
		</div>
	);
}
