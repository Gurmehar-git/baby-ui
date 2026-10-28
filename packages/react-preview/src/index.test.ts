import { beforeEach, expect, test } from "bun:test";
import {
	type DemoComponent,
	type DemoSource,
	loadDemo,
	MissingDemoError,
	resetCaches,
} from "./index.ts";

const Demo: DemoComponent = () => null;

beforeEach(resetCaches);

test("shares one in-flight load per slug", async () => {
	let calls = 0;
	const source: DemoSource = async () => ({
		button: async () => {
			calls++;
			return { default: Demo };
		},
	});
	const [a, b] = await Promise.all([
		loadDemo(source, "button"),
		loadDemo(source, "button"),
	]);
	expect(a).toBe(Demo);
	expect(b).toBe(Demo);
	expect(calls).toBe(1);
});

test("evicts a failed load so a retry runs again", async () => {
	let calls = 0;
	const source: DemoSource = async () => ({
		flaky: async () => {
			calls++;
			if (calls === 1) throw new Error("network");
			return { default: Demo };
		},
	});
	await expect(loadDemo(source, "flaky")).rejects.toThrow("network");
	expect(await loadDemo(source, "flaky")).toBe(Demo);
	expect(calls).toBe(2);
});

test("rejects a slug with no React demo", async () => {
	const source: DemoSource = async () => ({});
	await expect(loadDemo(source, "missing")).rejects.toBeInstanceOf(MissingDemoError);
});
