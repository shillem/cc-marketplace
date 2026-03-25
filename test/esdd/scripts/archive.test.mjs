import { describe, test, expect } from "bun:test";
import { existsSync, readdirSync } from "fs";
import { resolve } from "path";
import { createTmpDir, initFixture, run, writeFixture } from "./helpers.mjs";

describe("archive.mjs", () => {
  test("fails without a change name", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("archive.mjs", [], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("Usage");
  });

  test("rejects invalid change name", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("archive.mjs", ["bad name!"], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("Invalid change name");
  });

  test("fails if change does not exist", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("archive.mjs", ["nonexistent"], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("not found");
  });

  test("moves change to archive directory", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/proposal.md", "# Proposal");

    const { json, exitCode } = await run("archive.mjs", ["add-auth"], { esddPath });

    expect(exitCode).toBe(0);
    expect(json.archived).toBeDefined();
    expect(json.archived.from).toContain("add-auth");
    expect(existsSync(resolve(esddPath, "changes/add-auth"))).toBe(false);

    const archiveDirs = readdirSync(resolve(esddPath, "archive"));
    expect(archiveDirs).toHaveLength(1);
    expect(archiveDirs[0]).toMatch(/^\d{4}-\d{2}-\d{2}-add-auth$/);
  });

  test("detects new domains from spec delta files", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/specs/auth/spec.md", "# Auth spec");
    writeFixture(esddPath, "changes/add-auth/specs/billing/spec.md", "# Billing spec");

    const { json } = await run("archive.mjs", ["add-auth"], { esddPath });

    expect(json.domainsAdded).toContain("auth");
    expect(json.domainsAdded).toContain("billing");
  });

  test("does not add already-known domains", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath, { domains: [{ name: "auth", description: "Authentication" }] });
    writeFixture(esddPath, "changes/add-auth/specs/auth/spec.md", "# Auth spec");

    const { json } = await run("archive.mjs", ["add-auth"], { esddPath });

    expect(json.domainsAdded).toEqual([]);
  });

  test("fails if not initialized", async () => {
    const esddPath = createTmpDir();
    writeFixture(esddPath, "changes/add-auth/.keep", "");

    const { json, exitCode } = await run("archive.mjs", ["add-auth"], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toBeDefined();
  });
});
