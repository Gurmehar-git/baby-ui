import { untrack } from "svelte";
import {
	EASE_OUT,
	type Ease,
	prefersReducedMotion,
	Spring,
	type SpringConfig,
	tween,
} from "../../chart/svelte/motion";

type Apply = (node: SVGElement, progress: number) => void;

/** Attachment: a 0 to 1 spring after `delay` seconds; `apply` reruns when its inputs change. */
export function enterSpring(
	config: SpringConfig,
	delay: number,
	animate: boolean,
	apply: Apply,
) {
	return (node: SVGElement) => {
		let progress = $state(animate ? 0 : 1);
		$effect(() => apply(node, progress));
		return untrack(() => {
			const spring = new Spring(0, config, (v) => {
				progress = v;
			});
			if (!animate || prefersReducedMotion()) {
				spring.jump(1);
				return;
			}
			const timer = setTimeout(() => spring.set(1), delay * 1000);
			return () => {
				clearTimeout(timer);
				spring.stop();
			};
		});
	};
}

/** Attachment: a 0 to 1 tween after `delay` seconds. */
export function enterTween(
	duration: number,
	delay: number,
	animate: boolean,
	apply: Apply,
	ease: Ease = EASE_OUT,
) {
	return (node: SVGElement) => {
		let progress = $state(animate ? 0 : 1);
		$effect(() => apply(node, progress));
		return untrack(() => {
			if (!animate) return;
			const playback = tween({
				duration,
				delay: delay * 1000,
				ease,
				onUpdate: (p) => {
					progress = p;
				},
			});
			return () => playback.stop();
		});
	};
}
