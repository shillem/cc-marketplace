#!/usr/bin/env node

import { resolve } from "path";
import { esddPath, listDirs, output, outputError } from "./lib/fs-utils.mjs";
import { loadConfig } from "./lib/config.mjs";
import { computeChange, phasesFromArgs } from "./lib/status.mjs";

const args = process.argv.slice(2);

const result = loadConfig();
if (result.error) {
  outputError(result.error);
  process.exit(1);
}

const { schema } = result;

function buildEntry(name) {
  const entry = computeChange(name, schema, phasesFromArgs(args), { trackLastModified: true });

  if (entry.error || !entry.plan) return entry;

  const artifacts = {};
  for (const id of entry.plan.workflow) {
    artifacts[id] = entry.plan.artifacts[id].status;
  }
  entry.plan = { ...entry.plan, artifacts };

  return entry;
}

const changesDir = resolve(esddPath(), "changes");
const changes = listDirs(changesDir).map(buildEntry);
output({ changes });
