"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(min-width: 768px)";

function subscribe(onChange: () => void) {
	const mql = window.matchMedia(QUERY);
	mql.addEventListener("change", onChange);
	return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
	return !window.matchMedia(QUERY).matches;
}

/** SSR/first-paint default is desktop; corrects to the real value once mounted. */
function getServerSnapshot() {
	return false;
}

export function useIsMobile() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
