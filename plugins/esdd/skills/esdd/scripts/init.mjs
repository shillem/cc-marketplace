#!/usr/bin/env node

import { relative, resolve } from "path";
import { esddPath, exists, ensureDir, writeYaml, output, outputError } from "./lib/fs-utils.mjs";
import { checkConstitution, getConfigPath, loadConfig } from "./lib/config.mjs";

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
  const config = loadConfig();
  output({ workflows: config.workflows, constitution: checkConstitution() });
  process.exit(0);
}

if (args.includes("--create")) {
  const config = loadConfig();

  if (!config.error) {
    outputError("ESDD is already initialized");
    process.exit(1);
  }

  const domains = [];
  let workflow = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--domain" && args[i + 1]) {
      const value = args[i + 1];
      const colonIndex = value.indexOf(":");

      if (colonIndex === -1) {
        domains.push({ name: value, description: "" });
      } else {
        domains.push({
          name: value.slice(0, colonIndex).trim(),
          description: value.slice(colonIndex + 1).trim()
        });
      }

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

  const dirs = [resolve(root, "changes"), resolve(root, "archive")];

  for (const domain of domains) {
    dirs.push(resolve(root, "domains", domain.name));
  }

  if (domains.length === 0) {
    dirs.push(resolve(root, "domains"));
  }

  for (const dir of dirs) {
    ensureDir(dir);
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
