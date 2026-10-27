import { createContext } from "svelte";
import type { TestimonialVariant } from "../variants";

export type TestimonialContext = { readonly variant: TestimonialVariant };
export const [getTestimonial, setTestimonial] = createContext<TestimonialContext>();
