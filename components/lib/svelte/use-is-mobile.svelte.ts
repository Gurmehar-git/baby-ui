import { onMount } from "svelte";

const QUERY = "(min-width: 768px)";

/** SSR/first-paint default is desktop; corrects to the real value in onMount, so the
 * client's first render matches SSR output and only flips after hydration completes. */
export function useIsMobile() {
	let isMobile = $state(false);

	onMount(() => {
		const mql = window.matchMedia(QUERY);
		isMobile = !mql.matches;
		const onChange = () => {
			isMobile = !mql.matches;
		};
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	});

	return {
		get current() {
			return isMobile;
		},
	};
}
