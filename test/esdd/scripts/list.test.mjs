import { describe, test, expect } from "bun:test";
import { createTmpDir, initFixture, run, writeFixture } from "./helpers.mjs";

describe("list.mjs", () => {
  test("returns empty list when no changes exist", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("list.mjs", [], { esddPath });

    expect(exitCode).toBe(0);
    expect(json.changes).toEqual([]);
  });

  test("lists active changes with artifact statuses", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/proposal.md", "# Proposal");
    writeFixture(esddPath, "changes/add-billing/.keep", "");

    const { json, exitCode } = await run("list.mjs", [], { esddPath });

    expect(exitCode).toBe(0);
    expect(json.changes).toHaveLength(2);

    const names = json.changes.map(c => c.name);
    expect(names).toContain("add-auth");
    expect(names).toContain("add-billing");
  });

  test("shows artifact statuses as flat values", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/proposal.md", "# Proposal");

    const { json } = await run("list.mjs", [], { esddPath });

    const change = json.changes.find(c => c.name === "add-auth");
    expect(change.plan.artifacts.proposal).toBe("ready");
    expect(change.plan.artifacts.specs).toBe("pending");
  });

  test("--plan filters to plan phase only", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/.keep", "");

    const { json } = await run("list.mjs", ["--plan"], { esddPath });

    const change = json.changes[0];
    expect(change.plan).toBeDefined();
    expect(change.apply).toBeUndefined();
  });

  test("--apply filters to apply phase only", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/.keep", "");

    const { json } = await run("list.mjs", ["--apply"], { esddPath });

    const change = json.changes[0];
    expect(change.apply).toBeDefined();
    expect(change.plan).toBeUndefined();
  });

  test("fails if not initialized", async () => {
    const esddPath = createTmpDir();

    const { json, exitCode } = await run("list.mjs", [], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toBeDefined();
  });
});
