import type { ComponentSpec } from "@baby-ui/registry-schema";

// Eager, so the registry stays synchronous; server-only, so specs never reach the client.
const specs = import.meta.glob<ComponentSpec[]>(
	"../../../../../pro/components/specs.ts",
	{ eager: true, import: "proSpecs" },
);

/** Every Pro spec when the private checkout is present, shown or not; the registry filters. */
export const proSpecs: readonly ComponentSpec[] = Object.values(specs).flat();
