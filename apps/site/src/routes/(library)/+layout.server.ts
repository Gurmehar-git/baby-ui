import { sidebarGroups } from "#lib/server/registry.js";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = () => ({ groups: sidebarGroups() });
