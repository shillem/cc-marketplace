import { mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { tmpdir } from "os";
import yaml from "../../../plugins/esdd/skills/esdd/scripts/vendor/js-yaml.mjs";

const SCRIPTS_DIR = resolve(import.meta.dir, "../../../plugins/esdd/skills/esdd/scripts");

export function createTmpDir() {
  const dir = resolve(tmpdir(), `esdd-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function initFixture(esddDir, { workflow = "spec-anchored", domains = [] } = {}) {
  writeYamlFixture(esddDir, "config.yaml", { workflow, domains });
  mkdirSync(resolve(esddDir, "changes"), { recursive: true });
  mkdirSync(resolve(esddDir, "archive"), { recursive: true });
  mkdirSync(resolve(esddDir, "domains"), { recursive: true });
}

export async function run(action, args = [], { esddPath }) {
  const proc = Bun.spawn(["bun", resolve(SCRIPTS_DIR, "cli.mjs"), action, ...args], {
    env: { ...process.env, ESDD_PATH: esddPath },
    stdout: "pipe",
    stderr: "pipe"
  });

  const exitCode = await proc.exited;
  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();

  let json = null;
  try {
    json = JSON.parse(stdout);
  } catch {}

  return { exitCode, stdout, stderr, json };
}

export function writeFixture(base, relPath, content) {
  const fullPath = resolve(base, relPath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content);
}

export function writeYamlFixture(base, relPath, data) {
  writeFixture(base, relPath, yaml.dump(data, { lineWidth: -1, noRefs: true }));
}
