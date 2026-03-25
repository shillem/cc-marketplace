import { describe, test, expect } from "bun:test";
import { createTmpDir, initFixture, run, writeFixture } from "./helpers.mjs";

describe("status.mjs", () => {
  test("fails without a change name", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("status.mjs", [], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("Usage");
  });

  test("returns plan and apply status for a new change", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/.keep", "");

    const { json, exitCode } = await run("status.mjs", ["add-auth"], { esddPath });

    expect(exitCode).toBe(0);
    expect(json.name).toBe("add-auth");
    expect(json.plan).toBeDefined();
    expect(json.plan.workflow).toEqual(["proposal", "specs", "design", "tasks"]);
    expect(json.apply).toBeDefined();
  });

  test("--plan returns only plan status", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/.keep", "");

    const { json, exitCode } = await run("status.mjs", ["add-auth", "--plan"], { esddPath });

    expect(exitCode).toBe(0);
    expect(json.plan).toBeDefined();
    expect(json.apply).toBeUndefined();
  });

  test("--apply returns only apply status", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/.keep", "");

    const { json, exitCode } = await run("status.mjs", ["add-auth", "--apply"], { esddPath });

    expect(exitCode).toBe(0);
    expect(json.apply).toBeDefined();
    expect(json.plan).toBeUndefined();
  });

  test("shows ready status for existing artifacts", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/proposal.md", "# Proposal\n## Why\nNeed auth");

    const { json } = await run("status.mjs", ["add-auth", "--plan"], { esddPath });

    expect(json.plan.artifacts.proposal.status).toBe("ready");
    expect(json.plan.artifacts.specs.status).toBe("pending");
  });

  test("reports tasks artifact as invalid when no checkboxes", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/proposal.md", "# Proposal");
    writeFixture(esddPath, "changes/add-auth/specs/auth/spec.md", "# Spec");
    writeFixture(esddPath, "changes/add-auth/design.md", "# Design");
    writeFixture(esddPath, "changes/add-auth/tasks.md", "No checkboxes here");

    const { json } = await run("status.mjs", ["add-auth", "--plan"], { esddPath });

    expect(json.plan.artifacts.tasks.status).toBe("invalid");
  });

  test("reports tasks artifact as ready with valid checkboxes", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/proposal.md", "# Proposal");
    writeFixture(esddPath, "changes/add-auth/specs/auth/spec.md", "# Spec");
    writeFixture(esddPath, "changes/add-auth/design.md", "# Design");
    writeFixture(esddPath, "changes/add-auth/tasks.md", "## Group 1\n- [ ] 1.1 Do something");

    const { json } = await run("status.mjs", ["add-auth", "--plan"], { esddPath });

    expect(json.plan.artifacts.tasks.status).toBe("ready");
  });
});
