#!/usr/bin/env node

import { resolve } from "path";
import { esddPath, listDirs, output } from "./lib/fs-utils.mjs";
import { Config } from "./lib/config.mjs";
import { computeChange } from "./lib/status.mjs";
import { monitorErrors, parsePhases } from "./lib/init.mjs";

function buildEntry(changeName) {
  const schema = config.schema({ changeName });
  const entry = computeChange(changeName, schema, parsePhases(args), { trackLastModified: true });

  if (entry.error || !entry.plan) return entry;

  const artifacts = {};
  for (const id of entry.plan.workflow) {
    artifacts[id] = entry.plan.artifacts[id].status;
  }
  entry.plan = { ...entry.plan, artifacts };

  return entry;
}

monitorErrors();

const args = process.argv.slice(2);

const config = new Config();
config.schema();

const changesDir = resolve(esddPath(), "changes");
const changes = listDirs(changesDir).map(buildEntry);
output({ changes });
