#!/usr/bin/env node

import { relative } from "path";
import { changePath, output, outputError } from "./lib/fs-utils.mjs";
import { Config } from "./lib/config.mjs";
import { computeChange } from "./lib/status.mjs";
import { monitorErrors, parsePhases } from "./lib/init.mjs";

monitorErrors();

const args = process.argv.slice(2);

const changeName = args.find(a => !a.startsWith("--")) || null;

if (!changeName) {
  outputError("Usage: status.mjs <name> [--plan|--apply|--archive]");
  process.exit(1);
}

const config = new Config();
const schema = config.schema({ changeName });
const entry = computeChange(changeName, schema, parsePhases(args));

if (entry.error) {
  output(entry);
  process.exit(1);
}

entry.path = relative(process.cwd(), changePath(changeName));

output(entry);
