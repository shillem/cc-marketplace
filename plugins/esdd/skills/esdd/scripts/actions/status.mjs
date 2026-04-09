import { relative } from "path";
import { changePath, output, outputError } from "../lib/fs-utils.mjs";
import { Config } from "../lib/config.mjs";
import { computeChange } from "../lib/status.mjs";
import { parsePhases } from "../lib/init.mjs";

export function run(args) {
  const changeName = args.find(a => !a.startsWith("--")) || null;

  if (!changeName) {
    outputError("Usage: cli.mjs status <name> [--plan|--apply|--archive]");
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
}
