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

const src = "../packages/ui-react/src";
const { button } = await import(`${src}/button/variants.ts`);
const { selectTrigger } = await import(`${src}/select/variants.ts`);
const { input } = await import(`${src}/input/variants.ts`);
const { nativeSelect } = await import(`${src}/native-select/variants.ts`);
const { inputGroup } = await import(`${src}/input-group/variants.ts`);
const { combobox } = await import(`${src}/combobox/variants.ts`);
const { toggleButton } = await import(`${src}/toggle/variants.ts`);
const { toggleGroup } = await import(`${src}/toggle-group/variants.ts`);

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
};

for (const [name, classes] of Object.entries(CONTROLS)) {
	test(`${name} sits on the control ladder at every size`, () => {
		for (const [size, expected] of Object.entries(LADDER)) {
			const tokens = classes(size).split(/\s+/);
			for (const cls of expected) {
				assert.ok(tokens.includes(cls), `${name} ${size}: missing ${cls}`);
			}
		}
	});
}
