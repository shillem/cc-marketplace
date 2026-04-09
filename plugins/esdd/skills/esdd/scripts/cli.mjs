#!/usr/bin/env node

import { outputError } from "./lib/fs-utils.mjs";
import { ConfigError } from "./lib/config.mjs";

const ACTIONS = {
  archive: () => import("./actions/archive.mjs"),
  document: () => import("./actions/document.mjs"),
  init: () => import("./actions/init.mjs"),
  instructions: () => import("./actions/instructions.mjs"),
  list: () => import("./actions/list.mjs"),
  new: () => import("./actions/new.mjs"),
  status: () => import("./actions/status.mjs"),
  view: () => import("./actions/view.mjs")
};

process.on("uncaughtException", err => {
  if (err instanceof ConfigError) {
    outputError(err.message);
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});

const [action, ...args] = process.argv.slice(2);

if (!action || !ACTIONS[action]) {
  outputError(`Unknown action '${action || ""}'. Available: ${Object.keys(ACTIONS).join(", ")}`);
  process.exit(1);
}

const mod = await ACTIONS[action]();
await mod.run(args);
