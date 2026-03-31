#!/usr/bin/env node

import { relative, resolve } from "path";
import { renameSync } from "fs";
import {
  changePath,
  esddPath,
  exists,
  isMultiFileOutput,
  listDirs,
  multiFileOutputFilename,
  multiFileOutputPrefix,
  output,
  outputError,
  readFrontmatter,
  validateChangeName
} from "./lib/fs-utils.mjs";
import { loadConfig, updateConfig } from "./lib/config.mjs";

const name = process.argv[2];

if (!name) {
  outputError("Usage: archive.mjs <name>");
  process.exit(1);
}

if (!validateChangeName(name)) {
  outputError("Invalid change name (use alphanumeric, hyphens, underscores)");
  process.exit(1);
}

const srcPath = changePath(name);

if (!exists(srcPath)) {
  outputError(`Change '${name}' not found`);
  process.exit(1);
}

const cwd = process.cwd();
const today = new Date().toISOString().slice(0, 10);
const archiveName = `${today}-${name}`;
const archivePath = resolve(esddPath(), "archive", archiveName);

if (exists(archivePath)) {
  outputError(`Archive target already exists: ${relative(cwd, archivePath)}`);
  process.exit(1);
}

const result = loadConfig();
if (result.error) {
  outputError(result.error);
  process.exit(1);
}

const domains = [];

const { schema } = result;
const archive = schema.phases.archive || [];
const existingDomains = new Set(result.domains.map(d => d.name));

for (const id of archive) {
  const art = schema.artifacts[id];

  if (!isMultiFileOutput(art.output)) continue;

  const deltaDir = resolve(srcPath, multiFileOutputPrefix(art.output));

  if (!exists(deltaDir)) continue;

  const filename = multiFileOutputFilename(art.output);

  for (const dir of listDirs(deltaDir)) {
    const fm = readFrontmatter(resolve(deltaDir, dir, filename));

    if (fm?.description) {
      domains.push({ name: dir, description: fm.description });
    }
  }
}

renameSync(srcPath, archivePath);

const response = {
  archived: {
    from: relative(cwd, srcPath),
    to: relative(cwd, archivePath)
  }
};

if (domains.length > 0) {
  updateConfig({ domains });

  response.domains = domains.map(d => d.name);
}

output(response);
