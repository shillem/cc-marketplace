import { relative, resolve } from "path";
import { renameSync } from "fs";
import {
  changePath,
  esddPath,
  exists,
  isMultiFileOutput,
  listFiles,
  multiFileOutputPrefix,
  multiFileOutputSuffix,
  output,
  outputError,
  readFrontmatter,
  validateChangeName
} from "../lib/fs-utils.mjs";
import { Config } from "../lib/config.mjs";

export function run(args) {
  const changeName = args[0] || null;

  if (!changeName) {
    outputError("Usage: cli.mjs archive <name>");
    process.exit(1);
  }

  if (!validateChangeName(changeName)) {
    outputError("Invalid change name (use alphanumeric, hyphens, underscores)");
    process.exit(1);
  }

  const srcPath = changePath(changeName);

  if (!exists(srcPath)) {
    outputError(`Change '${changeName}' not found`);
    process.exit(1);
  }

  const cwd = process.cwd();
  const today = new Date().toISOString().slice(0, 10);
  const archiveName = `${today}-${changeName}`;
  const archivePath = resolve(esddPath(), "archive", archiveName);

  if (exists(archivePath)) {
    outputError(`Archive target already exists: ${relative(cwd, archivePath)}`);
    process.exit(1);
  }

  const config = new Config();

  const domains = [];

  const schema = config.schema({ changeName });
  const archive = schema.phases.archive || [];

  for (const id of archive) {
    const art = schema.artifacts[id];

    if (!isMultiFileOutput(art.output)) continue;

    const deltaDir = resolve(srcPath, multiFileOutputPrefix(art.output));

    if (!exists(deltaDir)) continue;

    const suffix = multiFileOutputSuffix(art.output);

    for (const name of listFiles(deltaDir, suffix)) {
      const fm = readFrontmatter(resolve(deltaDir, name));

      if (fm?.description) {
        domains.push({ name: name.slice(0, -suffix.length), description: fm.description });
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
    config.updateConfig({ domains });

    response.domains = domains.map(d => d.name);
  }

  output(response);
}
