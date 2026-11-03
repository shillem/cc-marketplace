import { describe, test, expect } from "bun:test";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import yaml from "../../../plugins/esdd/skills/esdd/scripts/vendor/js-yaml.mjs";
import { CUSTOM_WORKFLOWS, createTmpDir, initFixture, run, writeFixture } from "./helpers.mjs";

describe("new", () => {
  test("creates a new change directory and returns status", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("new", ["add-auth"], { esddPath });

    expect(exitCode).toBe(0);
    expect(json.name).toBe("add-auth");
    expect(json.plan).toBeDefined();
    expect(json.plan.workflow).toEqual(["proposal", "specs", "design", "tasks"]);
    expect(existsSync(resolve(esddPath, "changes/add-auth"))).toBe(true);
  });

  test("fails without a change name", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("new", [], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("Usage");
  });

  test("rejects invalid change name", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("new", ["invalid name!"], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("Invalid change name");
  });

  test("fails if change already exists", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/.keep", "");

    const { json, exitCode } = await run("new", ["add-auth"], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("already exists");
  });

  test("fails if not initialized", async () => {
    const esddPath = createTmpDir();

    const { json, exitCode } = await run("new", ["add-auth"], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toBeDefined();
  });

  test("first artifact is pending, rest are blocked", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json } = await run("new", ["my-change"], { esddPath });

    const artifacts = json.plan.artifacts;
    expect(artifacts.proposal.status).toBe("pending");
    expect(artifacts.specs.status).toBe("blocked");
    expect(artifacts.design.status).toBe("blocked");
    expect(artifacts.tasks.status).toBe("blocked");
  });

  test("--workflow creates change with specified workflow", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath, { workflows: CUSTOM_WORKFLOWS });

    const { json, exitCode } = await run("new", ["quick-fix", "--workflow", "light"], {
      esddPath
    });

    expect(exitCode).toBe(0);
    expect(json.name).toBe("quick-fix");
    expect(json.plan.workflow).toEqual(["proposal", "tasks"]);
    expect(json.plan.artifacts.proposal.status).toBe("pending");
    expect(json.plan.artifacts.tasks.status).toBe("blocked");
  });

  test("--workflow writes change.yaml with workflow", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    await run("new", ["quick-fix", "--workflow", "spec-local"], { esddPath });

    const changeConfig = yaml.load(
      readFileSync(resolve(esddPath, "changes/quick-fix/change.yaml"), "utf8")
    );
    expect(changeConfig.workflow).toBe("spec-local");
  });

  test("default writes change.yaml with project workflow", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    await run("new", ["my-change"], { esddPath });

    const changeConfig = yaml.load(
      readFileSync(resolve(esddPath, "changes/my-change/change.yaml"), "utf8")
    );
    expect(changeConfig.workflow).toBe("spec-global");
  });

  test("--workflow rejects unknown workflow", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("new", ["my-change", "--workflow", "nonexistent"], {
      esddPath
    });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("Unknown workflow");
    expect(json.error).toContain("nonexistent");
  });

  test("--workflow works with name before or after flag", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath, { workflows: CUSTOM_WORKFLOWS });

    const { json, exitCode } = await run("new", ["--workflow", "light", "my-change"], {
      esddPath
    });

    expect(exitCode).toBe(0);
    expect(json.name).toBe("my-change");
    expect(json.plan.workflow).toEqual(["proposal", "tasks"]);
  });
});
