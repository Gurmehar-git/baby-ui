export interface ErrorBoundaryLabels {
	title: string;
	description: string;
	retry: string;
	details: string;
}

export const ERROR_BOUNDARY_LABELS: ErrorBoundaryLabels = {
	title: "Something went wrong",
	description: "This part of the page failed to load. The rest still works.",
	retry: "Try again",
	details: "Error details",
};

/** A readable line from whatever was thrown: Errors, strings, or anything else. */
export function errorMessage(error: unknown): string {
	if (error instanceof Error) return error.message || error.name;
	if (typeof error === "string") return error;
	try {
		return JSON.stringify(error);
	} catch {
		return String(error);
	}
}

/** True when any reset key changed, so a fixed cause clears the error without a click. */
export function resetKeysChanged(
	prev: readonly unknown[] = [],
	next: readonly unknown[] = [],
) {
	return prev.length !== next.length || prev.some((key, i) => !Object.is(key, next[i]));
}
