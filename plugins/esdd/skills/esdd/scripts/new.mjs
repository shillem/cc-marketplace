#!/usr/bin/env node

import {
  changePath,
  exists,
  ensureDir,
  output,
  outputError,
  validateChangeName
} from "./lib/fs-utils.mjs";
import { Config } from "./lib/config.mjs";
import { computeChange } from "./lib/status.mjs";

const args = process.argv.slice(2);
let name = null;
let workflowName = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--workflow" && args[i + 1]) {
    workflowName = args[i + 1];
    i++;
  } else if (!name) {
    name = args[i];
  }
}

if (!name) {
  outputError("Usage: new.mjs <name> [--workflow <workflow>]");
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

const config = new Config();
if (config.error) {
  outputError(config.error);
  process.exit(1);
}

if (workflowName) {
  const names = config.workflows.map(w => w.name);

  if (!names.includes(workflowName)) {
    outputError(`Unknown workflow '${workflowName}'. Available: ${names.join(", ")}`);
    process.exit(1);
  }
}

const schema = config.schema({ workflowName });

if (schema.errors) {
  outputError(`Workflow '${schema.workflow}' has errors: ${schema.errors.join(", ")}`);
  process.exit(1);
}

ensureDir(dest);
config.writeChangeConfig(name, { workflow: schema.workflow });

output(computeChange(name, schema, []));
