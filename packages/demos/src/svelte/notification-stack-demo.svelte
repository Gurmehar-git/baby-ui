<script lang="ts">
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
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { NOTIFICATION_STACK_NOTICES } from "../data/notification-stack";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof NotificationStack>>(props));
let dismissed = $state<string[]>([]);
</script>

<div class="flex w-full max-w-95 flex-col items-center gap-3">
	<NotificationStack variant={p.variant} bind:value={dismissed}>
		{#each NOTIFICATION_STACK_NOTICES as n (n.id)}
			<NotificationStackItem value={n.id}>
				<NotificationStackPattern pattern={n.pattern} />
				<NotificationStackBody>
					<NotificationStackHeader>
						<NotificationStackBadge>{n.badge}</NotificationStackBadge>
						<NotificationStackDismiss />
					</NotificationStackHeader>
					<NotificationStackTitle>{n.title}</NotificationStackTitle>
					<NotificationStackDescription>{n.text}</NotificationStackDescription>
					{#if n.action}
						<NotificationStackActions>
							<NotificationStackAction href={n.action.href} external={n.action.external}>{n.action.label}</NotificationStackAction>
						</NotificationStackActions>
					{/if}
				</NotificationStackBody>
			</NotificationStackItem>
		{/each}
		<NotificationStackEmpty>You're all caught up.</NotificationStackEmpty>
	</NotificationStack>
	<Button variant="ghost" size="sm" disabled={dismissed.length === 0} onclick={() => (dismissed = [])}>Reset</Button>
</div>
