#!/usr/bin/env node

import { output, outputError } from "./lib/fs-utils.mjs";
import { Config } from "./lib/config.mjs";
import { monitorErrors, parseArg, parsePhases } from "./lib/init.mjs";
import {
  buildApplyInstructions,
  buildArchiveInstructions,
  buildPlanInstructions
} from "./lib/instructions.mjs";

monitorErrors();

const args = process.argv.slice(2);
const changeName = args[0] || null;
const artifact = parseArg(args, "--artifact");
const phase = parsePhases(args)[0] || null;
const group = parseArg(args, "--group");
const groupId = group != null ? parseInt(group, 10) : null;

if (!changeName || !phase) {
  outputError(
    "Usage: instructions.mjs <name> --plan --artifact <artifact> | --apply --artifact <artifact> --group <group-id> | --archive --artifact <artifact>"
  );
  process.exit(1);
}

if (phase === "plan" && !artifact) {
  outputError("--plan requires --artifact <artifact>");
  process.exit(1);
}

if (phase === "apply" && (artifact == null || groupId == null)) {
  outputError("--apply requires both --artifact <artifact> and --group <group-id>");
  process.exit(1);
}

if (phase === "archive" && !artifact) {
  outputError("--archive requires --artifact <artifact>");
  process.exit(1);
}

const config = new Config();

let result;

if (phase === "archive") {
  result = buildArchiveInstructions(config, changeName, artifact);
} else if (phase === "apply") {
  result = buildApplyInstructions(config, changeName, artifact, groupId);
} else {
  result = buildPlanInstructions(config, changeName, artifact);
}

output(result);
