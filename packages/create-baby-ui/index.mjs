#!/usr/bin/env node
import { run } from "@baby-ui/cli";

const [node = "node", script = "create-baby-ui", ...args] = process.argv;
await run([node, script, "init", ...args]);
