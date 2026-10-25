<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { notificationStackState, setNotificationStackItem } from "./context";

let {
	value,
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & { value: string; children?: Snippet } = $props();
const ctx = notificationStackState("NotificationStackItem");
const titleId = $props.id();
const leaving = $derived(ctx.dismissed.includes(value));
const place = $derived(ctx.layout?.places[value]);
const behind = $derived(!leaving && (place?.depth ?? 0) > 0);
const placed = $derived(place !== undefined && !leaving && place.depth >= 0);

setNotificationStackItem({
	get value() {
		return value;
	},
	titleId,
});
</script>

<!-- One notice, identified by `value`. Behind the front card only its edge shows. -->
<article
	data-slot="notification-stack-item"
	data-value={value}
	data-behind={behind || undefined}
	data-leaving={leaving || undefined}
	aria-labelledby={titleId}
	aria-hidden={behind || leaving || undefined}
	inert={behind || leaving}
	{...rest}
	class={cn(ctx.styles.item(), classProp)}
	style:translate={placed && place ? `0 ${place.y}px` : undefined}
	style:scale={placed && place ? `${place.scale}` : undefined}
	style:z-index={placed && place ? 10 - place.depth : leaving ? 11 : undefined}
	style:opacity={placed && place && place.depth > 2 ? 0 : undefined}
>
	{@render children?.()}
</article>
