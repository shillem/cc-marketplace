#!/usr/bin/env node

import { output, outputError } from "./lib/fs-utils.mjs";
import { Config } from "./lib/config.mjs";
import {
  buildApplyInstructions,
  buildArchiveInstructions,
  buildPlanInstructions
} from "./lib/instructions.mjs";

const args = process.argv.slice(2);
let artifactId = null;
let phase = null;
let groupId = null;
let changeName = args[0] || null;

for (let i = 1; i < args.length; i++) {
  if (args[i] === "--artifact" && args[i + 1]) {
    artifactId = args[i + 1];
    i++;
  } else if (args[i] === "--plan") {
    phase = "plan";
  } else if (args[i] === "--apply") {
    phase = "apply";
  } else if (args[i] === "--archive") {
    phase = "archive";
  } else if (args[i] === "--group" && args[i + 1]) {
    groupId = parseInt(args[i + 1], 10);
    i++;
  }
}

if (!changeName || !phase) {
  outputError(
    "Usage: instructions.mjs <name> --plan --artifact <artifact> | --apply --artifact <artifact> --group <group-id> | --archive --artifact <artifact>"
  );
  process.exit(1);
}

if (phase === "plan" && !artifactId) {
  outputError("--plan requires --artifact <artifact>");
  process.exit(1);
}

if (phase === "apply" && (artifactId == null || groupId == null)) {
  outputError("--apply requires both --artifact <artifact> and --group <group-id>");
  process.exit(1);
}

if (phase === "archive" && !artifactId) {
  outputError("--archive requires --artifact <artifact>");
  process.exit(1);
}

const config = new Config();
if (config.error) {
  outputError(config.error);
  process.exit(1);
}

let result;

if (phase === "archive") {
  result = buildArchiveInstructions(config, changeName, artifactId);
} else if (phase === "apply") {
  result = buildApplyInstructions(config, changeName, artifactId, groupId);
} else {
  result = buildPlanInstructions(config, changeName, artifactId);
}

output(result);
