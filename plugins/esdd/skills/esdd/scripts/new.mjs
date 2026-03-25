#!/usr/bin/env node

import {
  changePath,
  exists,
  ensureDir,
  output,
  outputError,
  validateChangeName
} from "./lib/fs-utils.mjs";
import { loadConfig } from "./lib/config.mjs";
import { computeChange } from "./lib/status.mjs";

const name = process.argv[2];

if (!name) {
  outputError("Usage: new.mjs <name>");
  process.exit(1);
}

if (!validateChangeName(name)) {
  outputError("Invalid change name (use alphanumeric, hyphens, underscores)");
  process.exit(1);
}

const dest = changePath(name);

if (exists(dest)) {
  outputError(`Change '${name}' already exists`);
  process.exit(1);
}

const result = loadConfig();
if (result.error) {
  outputError(result.error);
  process.exit(1);
}

ensureDir(dest);

output(computeChange(name, result.schema, []));
