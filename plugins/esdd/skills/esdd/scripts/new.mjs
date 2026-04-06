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
import { monitorErrors, parseArg } from "./lib/init.mjs";

monitorErrors();

const args = process.argv.slice(2);
const workflowName = parseArg(args, "--workflow");
const name = args.find(a => !a.startsWith("--") && a !== workflowName) || null;

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

if (workflowName) {
  const names = config.workflows.map(w => w.name);

  if (!names.includes(workflowName)) {
    outputError(`Unknown workflow '${workflowName}'. Available: ${names.join(", ")}`);
    process.exit(1);
  }
}

const schema = config.schema({ workflowName });

ensureDir(dest);

config.writeChangeConfig(name, { workflow: schema.workflow });

output(computeChange(name, schema, []));
