<script lang="ts" module>
import type { HTMLAttributes } from "svelte/elements";
import type { MiddleTruncationVariant } from "../variants";

type TailStrategy = { end?: number; minEnd?: never } | { end?: never; minEnd?: number };

export type MiddleTruncationProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> &
	TailStrategy & {
		text: string;
		ellipsis?: string;
		variant?: MiddleTruncationVariant;
	};
</script>

<script lang="ts">
import type { Attachment } from "svelte/attachments";
import { cn } from "../../lib/cn";
import { textMetrics, truncateMiddle } from "../truncate";
import { middleTruncation } from "../variants";

let {
	text,
	ellipsis = "…",
	end,
	minEnd,
	variant = "default",
	class: classProp,
	...rest
}: MiddleTruncationProps = $props();
let displayed = $state<string>();

function measure(
	currentText: string,
	currentEllipsis: string,
	currentEnd?: number,
	currentMinEnd?: number,
): Attachment<HTMLSpanElement> {
	return (element) => {
		let frame = 0;
		let active = true;
		const update = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				if (!active) return;
				const { font, letterSpacing } = textMetrics(element);
				displayed = truncateMiddle(
					currentText,
					element.clientWidth,
					font,
					letterSpacing,
					currentEllipsis,
					currentEnd,
					currentMinEnd,
				);
			});
		};
		update();
		const observer = new ResizeObserver(update);
		observer.observe(element);
		document.fonts?.ready.then(update);
		return () => {
			active = false;
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	};
}
</script>

<span
	{@attach measure(text, ellipsis, end, minEnd)}
	data-slot="middle-truncation"
	class={cn(middleTruncation({ variant }), classProp)}
	title={text}
	{...rest}
><span aria-hidden="true">{displayed ?? text}</span><span class="sr-only">{text}</span></span>
