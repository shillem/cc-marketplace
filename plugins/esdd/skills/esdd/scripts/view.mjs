#!/usr/bin/env node

import { relative, resolve } from "path";
import { esddPath, listDirs, output, outputError } from "./lib/fs-utils.mjs";
import { checkConstitution, Config } from "./lib/config.mjs";
import { computeChange } from "./lib/status.mjs";

function buildEntry(changeName) {
  const changeSchema = config.schema({ changeName });
  const entry = computeChange(changeName, changeSchema, [], { trackLastModified: true });

  if (entry.error || !entry.plan) return entry;

  entry.workflow = changeSchema.workflow;

  const artifacts = {};

  for (const id of entry.plan.workflow) {
    artifacts[id] = entry.plan.artifacts[id].status;
  }
  entry.plan = { ...entry.plan, artifacts };

  if (entry.plan.lastModified) {
    entry.plan.lastModified = relativeTime(entry.plan.lastModified);
  }
  if (entry.apply?.lastModified) {
    entry.apply.lastModified = relativeTime(entry.apply.lastModified);
  }

  return entry;
}

function outputPhases(values) {
  return Object.keys(values).map(p => `${p} (${values[p].join(" → ")})`);
}

function relativeTime(iso) {
  const epoch = new Date(iso);
  if (epoch.getTime() === 0) return null;
  const ms = Date.now() - epoch.getTime();
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const config = new Config();
if (config.error) {
  outputError(config.error);
  process.exit(1);
}

const defaultSchema = config.schema();
const changesDir = resolve(esddPath(), "changes");
const archiveDir = resolve(esddPath(), "archive");

output({
  path: relative(process.cwd(), esddPath()),
  workflows: config.workflows.map(w => w.name).join(", "),
  defaultWorkflow: `${defaultSchema.workflow} = ${outputPhases(defaultSchema.phases)}`,
  domains: config.domains.map(d => d.name).join(", "),
  constitution: checkConstitution(),
  activeChanges: listDirs(changesDir).map(buildEntry),
  archivedChangesCount: listDirs(archiveDir).length
});
