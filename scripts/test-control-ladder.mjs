import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

// Package sources import siblings without extensions; resolve them to `.ts` here.
registerHooks({
	resolve(specifier, context, next) {
		try {
			return next(specifier, context);
		} catch (error) {
			if (!specifier.startsWith(".")) throw error;
			return next(`${specifier}.ts`, context);
		}
	},
});

const src = "../components";
const { button } = await import(`${src}/button/react/variants.ts`);
const { selectTrigger } = await import(`${src}/select/react/variants.ts`);
const { input } = await import(`${src}/input/react/variants.ts`);
const { nativeSelect } = await import(`${src}/native-select/react/variants.ts`);
const { inputGroup } = await import(`${src}/input-group/react/variants.ts`);
const { combobox } = await import(`${src}/combobox/react/variants.ts`);
const { toggleButton } = await import(`${src}/toggle/react/variants.ts`);
const { toggleGroup } = await import(`${src}/toggle-group/react/variants.ts`);
const { multiSelect } = await import(`${src}/multi-select/react/variants.ts`);
const { tagInput } = await import(`${src}/tag-input/react/variants.ts`);
const { dateField } = await import(`${src}/date-field/react/variants.ts`);
const { numberInput } = await import(`${src}/number-input/react/variants.ts`);
const { inputOtp } = await import(`${src}/input-otp/react/variants.ts`);
const { tabsFrame } = await import(`${src}/tabs/react/variants.ts`);
const { pagination } = await import(`${src}/pagination/react/variants.ts`);

// DESIGN.md "Control scale": every control of one size shares height and radius.
const LADDER = {
	xs: ["h-6", "rounded-sm"],
	sm: ["h-8", "rounded-md"],
	default: ["h-9", "rounded-lg"],
	lg: ["h-10", "rounded-lg"],
	xl: ["h-12", "rounded-xl"],
};

const CONTROLS = {
	button: (size) => button({ size }),
	select: (size) => selectTrigger({ size }),
	input: (size) => input({ size }),
	"native-select": (size) => nativeSelect({ size }).select(),
	"input-group": (size) => inputGroup({ size }).root(),
	combobox: (size) => combobox({ size }).trigger(),
	toggle: (size) => toggleButton({ size }),
	"toggle-group": (size) => toggleGroup({ size }).root(),
	"multi-select": (size) => multiSelect({ size }).root(),
	"tag-input": (size) => tagInput({ size }).root(),
	"date-field": (size) => dateField({ size }).group(),
	"number-input": (size) => numberInput({ size }).group(),
	"input-otp": (size) => inputOtp({ size }).slot(),
	"tabs (segment)": (size) => tabsFrame({ size, variant: "segment" }).list(),
	pagination: (size) => pagination({ size }).link(),
};

for (const [name, classes] of Object.entries(CONTROLS)) {
	test(`${name} sits on the control ladder at every size`, () => {
		for (const [size, expected] of Object.entries(LADDER)) {
			const tokens = classes(size).split(/\s+/);
			for (const cls of expected) {
				const ok = cls.startsWith("h-")
					? [cls, `min-${cls}`, cls.replace("h-", "size-")].some((c) =>
							tokens.includes(c),
						)
					: tokens.includes(cls);
				assert.ok(ok, `${name} ${size}: missing ${cls}`);
			}
		}
	});
}
