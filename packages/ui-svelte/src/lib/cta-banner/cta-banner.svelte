<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../lib/cn";
import { BANNER_DEFAULTS } from "./banner";
import { setCtaBanner } from "./context";
import { type CtaBannerSize, type CtaBannerVariant, ctaBanner } from "./variants";

let {
	children,
	variant = "grain",
	size = "default",
	tint,
	speed = BANNER_DEFAULTS.speed,
	class: classProp,
	onpointermove,
	...rest
}: {
	children?: Snippet;
	/** `grain`: a noisy tinted panel; `ticker`: lit copy beside a running wordmark; `spotlight`:
	 * a dark tint-lit card whose grid and edge light up under the pointer. */
	variant?: CtaBannerVariant;
	/** Padding and headline scale. */
	size?: CtaBannerSize;
	/** Any CSS colour. Defaults to green for grain, blue for ticker and `--primary` for spotlight. */
	tint?: string;
	/** Scales every loop inside: 2 is twice as fast, 0.5 half. */
	speed?: number;
	class?: string;
} & HTMLAttributes<HTMLElement> = $props();

const uid = $props.id();
const titleId = `${uid}-title`;
setCtaBanner(() => ({ variant, size, titleId }));
</script>

<!-- The pointer only steers the spotlight's light; nothing here is a control. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
	aria-labelledby={titleId}
	{...rest}
	data-slot="cta-banner"
	data-variant={variant}
	class={cn(ctaBanner({ variant, size }).root(), classProp)}
	style:--cta-banner={tint}
	style:--banner-speed={speed > 0 ? speed : BANNER_DEFAULTS.speed}
	onpointermove={(event) => {
		onpointermove?.(event);
		if (variant !== "spotlight") return;
		const box = event.currentTarget.getBoundingClientRect();
		event.currentTarget.style.setProperty("--x", `${event.clientX - box.left}px`);
		event.currentTarget.style.setProperty("--y", `${event.clientY - box.top}px`);
	}}
>
	{@render children?.()}
</section>
