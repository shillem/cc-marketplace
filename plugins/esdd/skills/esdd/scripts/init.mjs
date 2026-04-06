#!/usr/bin/env node

import { relative, resolve } from "path";
import { esddPath, exists, ensureDir, writeYaml, output, outputError } from "./lib/fs-utils.mjs";
import { checkConstitution, Config, getConfigPath } from "./lib/config.mjs";
import { parseDomain } from "./lib/init.mjs";

const args = process.argv.slice(2);

if (args.includes("--status")) {
  const initialized = exists(getConfigPath());

  output({
    initialized,
    ...(initialized && { constitution: checkConstitution() })
  });

  process.exit(0);
}

if (args.includes("--survey")) {
  const config = new Config();
  output({ workflows: config.workflows, constitution: checkConstitution() });
  process.exit(0);
}

if (args.includes("--create")) {
  if (exists(getConfigPath())) {
    outputError("ESDD is already initialized");
    process.exit(1);
  }

  const config = new Config();

  const domains = [];
  let workflow = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--domain" && args[i + 1]) {
      domains.push(parseDomain(args[i + 1]));
      i++;
    }

    if (args[i] === "--workflow" && args[i + 1]) {
      workflow = args[i + 1];
      i++;
    }
  }

  const names = config.workflows.map(w => w.name);

  if (workflow) {
    if (!names.includes(workflow)) {
      outputError(`Unknown workflow '${workflow}'. Available: ${names.join(", ")}`);
      process.exit(1);
    }
  } else {
    workflow = names[0];
  }

  const root = esddPath();
  ensureDir(root);
  writeYaml(getConfigPath(), { workflow, domains });

  for (const dir of ["archive", "changes", "domains", "templates"]) {
    ensureDir(resolve(root, dir));
  }

  const cwd = process.cwd();

  output({
    domains: domains.map(d => d.name).join(", "),
    path: relative(cwd, esddPath()),
    workflow
  });
  process.exit(0);
}

outputError(
  'Usage: init.mjs --status | --survey | --create --workflow <name> [--domain "name:description"]...'
);
process.exit(1);
