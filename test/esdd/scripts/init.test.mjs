import { describe, test, expect } from "bun:test";
import { existsSync } from "fs";
import { resolve } from "path";
import { createTmpDir, run, writeYamlFixture } from "./helpers.mjs";

describe("init.mjs", () => {
  test("--status returns uninitialized when no config exists", async () => {
    const esddPath = createTmpDir();
    const { json, exitCode } = await run("init.mjs", ["--status"], { esddPath });

    expect(exitCode).toBe(0);
    expect(json.initialized).toBe(false);
  });

  test("--status returns initialized when config exists", async () => {
    const esddPath = createTmpDir();
    writeYamlFixture(esddPath, "config.yaml", { workflow: "spec-anchored", domains: [] });

    const { json, exitCode } = await run("init.mjs", ["--status"], { esddPath });

    expect(exitCode).toBe(0);
    expect(json.initialized).toBe(true);
    expect(json.constitution).toBeDefined();
  });

  test("--survey returns available workflows", async () => {
    const esddPath = createTmpDir();
    const { json, exitCode } = await run("init.mjs", ["--survey"], { esddPath });

    expect(exitCode).toBe(0);
    expect(json.workflows).toBeArray();
    const names = json.workflows.map(w => w.name);
    expect(names).toContain("spec-anchored");
    expect(names).toContain("spec-first");
  });

  test("--create initializes esdd with default workflow", async () => {
    const esddPath = createTmpDir();
    const { json, exitCode } = await run("init.mjs", ["--create", "--workflow", "spec-anchored"], {
      esddPath
    });

    expect(exitCode).toBe(0);
    expect(json.workflow).toBe("spec-anchored");
    expect(existsSync(resolve(esddPath, "config.yaml"))).toBe(true);
    expect(existsSync(resolve(esddPath, "changes"))).toBe(true);
    expect(existsSync(resolve(esddPath, "archive"))).toBe(true);
    expect(existsSync(resolve(esddPath, "domains"))).toBe(true);
  });

  test("--create with domains records them in config", async () => {
    const esddPath = createTmpDir();
    const { json, exitCode } = await run(
      "init.mjs",
      [
        "--create",
        "--workflow",
        "spec-anchored",
        "--domain",
        "auth:Authentication",
        "--domain",
        "billing:Payments"
      ],
      { esddPath }
    );

    expect(exitCode).toBe(0);
    expect(json.domains).toBe("auth, billing");
    expect(existsSync(resolve(esddPath, "domains"))).toBe(true);
  });

  test("--create fails when already initialized", async () => {
    const esddPath = createTmpDir();
    writeYamlFixture(esddPath, "config.yaml", { workflow: "spec-anchored", domains: [] });

    const { json, exitCode } = await run("init.mjs", ["--create", "--workflow", "spec-anchored"], {
      esddPath
    });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("already initialized");
  });

  test("--create fails with unknown workflow", async () => {
    const esddPath = createTmpDir();
    const { json, exitCode } = await run("init.mjs", ["--create", "--workflow", "nonexistent"], {
      esddPath
    });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("Unknown workflow");
  });

  test("exits with error when no flags provided", async () => {
    const esddPath = createTmpDir();
    const { json, exitCode } = await run("init.mjs", [], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("Usage");
  });
});
