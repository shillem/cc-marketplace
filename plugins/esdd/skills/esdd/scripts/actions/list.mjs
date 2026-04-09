import { resolve } from "path";
import { esddPath, listDirs, output } from "../lib/fs-utils.mjs";
import { Config } from "../lib/config.mjs";
import { computeChange } from "../lib/status.mjs";
import { parsePhases } from "../lib/init.mjs";

export function run(args) {
  const config = new Config();
  config.schema(); // validates config exists

  const changesDir = resolve(esddPath(), "changes");
  const changes = listDirs(changesDir).map(name => buildEntry(config, name, args));
  output({ changes });
}

function buildEntry(config, changeName, args) {
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
