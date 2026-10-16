import { createContext } from "svelte";

/** A getter, so the label and content follow a group whose `collapsible` changes. */
export type PropertyPanelGroupContext = { readonly collapsible: boolean };

export const [getPropertyPanelGroup, setPropertyPanelGroup] =
	createContext<PropertyPanelGroupContext>();
