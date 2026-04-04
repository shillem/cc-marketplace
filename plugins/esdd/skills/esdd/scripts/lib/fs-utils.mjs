import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import yaml from "../vendor/js-yaml.mjs";

export function artifactPath(changeName, output) {
  const base = changePath(changeName);

  if (isMultiFileOutput(output)) {
    return resolve(base, multiFileOutputPrefix(output));
  }

  return resolve(base, output);
}

export function assetsPath() {
  return resolve(dirname(fileURLToPath(import.meta.url)), "../../assets");
}

export function changePath(name) {
  return resolve(esddPath(), "changes", name);
}

export function domainsPath() {
  return resolve(esddPath(), "domains");
}

export function ensureDir(dirPath) {
  mkdirSync(dirPath, { recursive: true });
}

export function esddPath() {
  return resolve(process.env.ESDD_PATH || ".ai/esdd");
}

export function exists(filePath) {
  return existsSync(filePath);
}

export function isMultiFileOutput(output) {
  return output != null && output.includes("{");
}

export function listDirs(dirPath) {
  try {
    return readdirSync(dirPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
  } catch {
    return [];
  }
}

export function listFiles(dirPath, ext) {
  try {
    return readdirSync(dirPath, { withFileTypes: true })
      .filter(d => d.isFile() && (!ext || d.name.endsWith(ext)))
      .map(d => d.name);
  } catch {
    return [];
  }
}

export function listOutputFiles(dirPath, filename) {
  const results = [];

  for (const dir of listDirs(dirPath)) {
    const filePath = resolve(dirPath, dir, filename);

    if (exists(filePath)) {
      results.push({ name: dir, path: filePath });
    }
  }

  return results;
}

export function multiFileOutputFilename(output) {
  return output.split("/").pop();
}

export function multiFileOutputPrefix(output) {
  return output.slice(0, output.indexOf("{"));
}

export function mtime(filePath) {
  return statSync(filePath).mtime;
}

export function mtimeOrNull(filePath) {
  try {
    return statSync(filePath).mtime;
  } catch {
    return null;
  }
}

export function output(data) {
  console.log(JSON.stringify(data, null, 2));
}

export function outputError(message) {
  output({ error: message });
}

export function readFrontmatter(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    const match = content.match(/^---\n([\s\S]*?)\n---/);

    if (!match) return null;

    return yaml.load(match[1]) || null;
  } catch {
    return null;
  }
}

export function readText(filePath) {
  return readFileSync(filePath, "utf8");
}

export function readYaml(filePath) {
  return yaml.load(readFileSync(filePath, "utf8"));
}

export function validateChangeName(name) {
  return /^[a-z0-9][a-z0-9_-]*$/i.test(name);
}

export function writeYaml(filePath, data) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, yaml.dump(data, { lineWidth: -1, noRefs: true }));
}
