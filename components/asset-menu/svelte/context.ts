import { createContext } from "svelte";
import type { AssetMenuVariant } from "../variants";

export type AssetMenuContext = { readonly variant: AssetMenuVariant };

export const [getAssetMenu, setAssetMenu] = createContext<AssetMenuContext>();
