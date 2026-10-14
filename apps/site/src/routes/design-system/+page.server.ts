import motionCss from "@baby-ui/tokens/motion.css?raw";
import tokensCss from "@baby-ui/tokens/tokens.css?raw";
import { tokenGroups } from "#lib/design-system/tokens.js";
import type { PageServerLoad } from "./$types";

export const prerender = true;

export const load: PageServerLoad = () => ({ groups: tokenGroups(tokensCss, motionCss) });
