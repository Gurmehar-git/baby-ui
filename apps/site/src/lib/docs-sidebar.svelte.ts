import { PersistedState } from "./persisted-state.svelte";

/** Whether the desktop docs sidebar is open; the choice survives reloads. */
export const docsSidebar = new PersistedState("baby-ui:docs-sidebar-open", true);

/** Whether the right "On this page" rail is open, from xl up. Closed by default so a page
 * shows three regions; a new key, as the old one stored `true` for every past visitor. */
export const outlineSidebar = new PersistedState("baby-ui:outline-rail-open", false);
