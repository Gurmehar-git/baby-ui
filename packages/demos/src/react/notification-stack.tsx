"use client";

import {
	Button,
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
import { type ComponentProps, useState } from "react";
import { NOTIFICATION_STACK_NOTICES } from "../data/notification-stack";
import { controlProps } from "../data/preview-props";

export function NotificationStackDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof NotificationStack>>(props);
	const [dismissed, setDismissed] = useState<string[]>([]);
	return (
		<div className="flex w-full max-w-95 flex-col items-center gap-3">
			<NotificationStack
				variant={p.variant}
				value={dismissed}
				onValueChange={setDismissed}
			>
				{NOTIFICATION_STACK_NOTICES.map((n) => (
					<NotificationStackItem key={n.id} value={n.id}>
						<NotificationStackPattern pattern={n.pattern} />
						<NotificationStackBody>
							<NotificationStackHeader>
								<NotificationStackBadge>{n.badge}</NotificationStackBadge>
								<NotificationStackDismiss />
							</NotificationStackHeader>
							<NotificationStackTitle>{n.title}</NotificationStackTitle>
							<NotificationStackDescription>{n.text}</NotificationStackDescription>
							{n.action ? (
								<NotificationStackActions>
									<NotificationStackAction
										href={n.action.href}
										external={n.action.external}
									>
										{n.action.label}
									</NotificationStackAction>
								</NotificationStackActions>
							) : null}
						</NotificationStackBody>
					</NotificationStackItem>
				))}
				<NotificationStackEmpty>You're all caught up.</NotificationStackEmpty>
			</NotificationStack>
			<Button
				variant="ghost"
				size="sm"
				disabled={dismissed.length === 0}
				onClick={() => setDismissed([])}
			>
				Reset
			</Button>
		</div>
	);
}
