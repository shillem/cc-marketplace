import { describe, test, expect } from "bun:test";
import { createTmpDir, initFixture, run, writeFixture, writeYamlFixture } from "./helpers.mjs";

describe("view.mjs", () => {
  test("returns project overview with no changes", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("view.mjs", [], { esddPath });

    expect(exitCode).toBe(0);
    expect(json.path).toBeDefined();
    expect(json.workflows).toContain("spec-anchored");
    expect(json.defaultWorkflow).toContain("spec-anchored");
    expect(json.activeChanges).toEqual([]);
    expect(json.archivedChangesCount).toBe(0);
  });

  test("lists active changes with status summaries", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/proposal.md", "# Proposal");

    const { json } = await run("view.mjs", [], { esddPath });

    expect(json.activeChanges).toHaveLength(1);
    expect(json.activeChanges[0].name).toBe("add-auth");
    expect(json.activeChanges[0].plan.artifacts.proposal).toBe("ready");
  });

  test("counts archived changes", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "archive/2026-01-01-old-change/.keep", "");
    writeFixture(esddPath, "archive/2026-02-01-another/.keep", "");

    const { json } = await run("view.mjs", [], { esddPath });

    expect(json.archivedChangesCount).toBe(2);
  });

  test("shows domains from config", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath, {
      domains: [
        { name: "auth", description: "Auth" },
        { name: "billing", description: "Pay" }
      ]
    });

    const { json } = await run("view.mjs", [], { esddPath });

    expect(json.domains).toBe("auth, billing");
  });

  test("includes per-change workflow in active changes", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/quick-fix/brief.md", "# Brief");
    writeYamlFixture(esddPath, "changes/quick-fix/change.yaml", { workflow: "spec-first-quick" });

    const { json } = await run("view.mjs", [], { esddPath });

    const change = json.activeChanges.find(c => c.name === "quick-fix");
    expect(change.workflow).toBe("spec-first-quick");
    expect(change.plan.artifacts.brief).toBe("ready");
  });

  test("fails if not initialized", async () => {
    const esddPath = createTmpDir();

    const { json, exitCode } = await run("view.mjs", [], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toBeDefined();
  });
});
