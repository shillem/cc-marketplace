#!/usr/bin/env node

import { relative } from "path";
import { changePath, output, outputError } from "./lib/fs-utils.mjs";
import { loadConfig } from "./lib/config.mjs";
import { computeChange, phasesFromArgs } from "./lib/status.mjs";

const args = process.argv.slice(2);

const changeName = args.find(a => !a.startsWith("--")) || null;

if (!changeName) {
  outputError("Usage: status.mjs <name> [--plan|--apply]");
  process.exit(1);
}

const result = loadConfig();
if (result.error) {
  output(result);
  process.exit(1);
}

const entry = computeChange(changeName, result.schema, phasesFromArgs(args));

if (entry.error) {
  output(entry);
  process.exit(1);
}

entry.path = relative(process.cwd(), changePath(changeName));

output(entry);
