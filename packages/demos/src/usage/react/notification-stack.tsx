"use client";

import {
	NotificationStack,
	NotificationStackAction,
	NotificationStackActions,
	NotificationStackBadge,
	NotificationStackBody,
	NotificationStackDescription,
	NotificationStackDismiss,
	NotificationStackEmpty,
	NotificationStackHeader,
	NotificationStackItem,
	NotificationStackPattern,
	NotificationStackTitle,
} from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [dismissed, setDismissed] = useState<string[]>([]);
	return (
		<NotificationStack value={dismissed} onValueChange={setDismissed}>
			<NotificationStackItem value="sso">
				<NotificationStackPattern pattern="orbit" />
				<NotificationStackBody>
					<NotificationStackHeader>
						<NotificationStackBadge>New</NotificationStackBadge>
						<NotificationStackDismiss />
					</NotificationStackHeader>
					<NotificationStackTitle>Single sign-on is here</NotificationStackTitle>
					<NotificationStackDescription>
						Connect Okta or Google Workspace.
					</NotificationStackDescription>
					<NotificationStackActions>
						<NotificationStackAction href="/settings/sso">
							Set it up
						</NotificationStackAction>
					</NotificationStackActions>
				</NotificationStackBody>
			</NotificationStackItem>
			<NotificationStackEmpty>You're all caught up.</NotificationStackEmpty>
		</NotificationStack>
	);
}
