import { describe, test, expect } from "bun:test";
import { createTmpDir, initFixture, run, writeFixture, writeYamlFixture } from "./helpers.mjs";

describe("instructions.mjs", () => {
  test("fails without change name or phase", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("instructions.mjs", [], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("Usage");
  });

  test("--plan requires --artifact", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("instructions.mjs", ["add-auth", "--plan"], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("--plan requires --artifact");
  });

  test("--apply requires --artifact and --group", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run(
      "instructions.mjs",
      ["add-auth", "--apply", "--artifact", "tasks"],
      { esddPath }
    );

    expect(exitCode).toBe(1);
    expect(json.error).toContain("--apply requires both");
  });

  test("returns plan instruction for proposal", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run(
      "instructions.mjs",
      ["add-auth", "--plan", "--artifact", "proposal"],
      { esddPath }
    );

    expect(exitCode).toBe(0);
    expect(json.review).toBe(true);
    expect(json.instruction).toContain("proposal document");
    expect(json.outputPath).toContain("proposal.md");
    expect(json.templatePath).toBeDefined();
    expect(json.dependencies).toEqual([]);
  });

  test("plan instruction for design includes review flag", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json } = await run("instructions.mjs", ["add-auth", "--plan", "--artifact", "design"], {
      esddPath
    });

    expect(json.review).toBe(true);
  });

  test("plan instruction for non-review artifact returns review false", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json } = await run("instructions.mjs", ["add-auth", "--plan", "--artifact", "tasks"], {
      esddPath
    });

    expect(json.review).toBe(false);
  });

  test("plan instruction for specs includes proposal as dependency when it exists", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/proposal.md", "# Proposal");

    const { json } = await run("instructions.mjs", ["add-auth", "--plan", "--artifact", "specs"], {
      esddPath
    });

    expect(json.dependencies).toHaveLength(1);
    expect(json.dependencies[0]).toContain("proposal.md");
  });

  test("plan instruction for tasks includes all prior artifacts as dependencies", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/proposal.md", "# Proposal");
    writeFixture(esddPath, "changes/add-auth/specs/auth.md", "# Spec");
    writeFixture(esddPath, "changes/add-auth/design.md", "# Design");

    const { json } = await run("instructions.mjs", ["add-auth", "--plan", "--artifact", "tasks"], {
      esddPath
    });

    expect(json.dependencies).toHaveLength(3);
    expect(json.dependencies[0]).toContain("proposal.md");
    expect(json.dependencies[2]).toContain("design.md");
  });

  test("plan instruction replaces {{DOMAINS}} with domain list", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath, { domains: [{ name: "auth", description: "Authentication" }] });

    const { json } = await run(
      "instructions.mjs",
      ["add-auth", "--plan", "--artifact", "proposal"],
      { esddPath }
    );

    expect(json.instruction).toContain("[auth]");
    expect(json.instruction).toContain(": Authentication");
    expect(json.instruction).not.toContain("{{DOMAINS}}");
  });

  test("plan instruction shows 'No domains defined yet.' when no domains", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json } = await run(
      "instructions.mjs",
      ["add-auth", "--plan", "--artifact", "proposal"],
      { esddPath }
    );

    expect(json.instruction).toContain("No domains defined yet.");
  });

  test("returns error for unknown plan artifact", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json } = await run(
      "instructions.mjs",
      ["add-auth", "--plan", "--artifact", "nonexistent"],
      { esddPath }
    );

    expect(json.error).toContain("not found in plan phase");
  });

  test("returns apply instruction with task group replacement", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(
      esddPath,
      "changes/add-auth/tasks.md",
      "## 1. Setup\n- [ ] 1.1 Create project\n## 2. Implement\n- [ ] 2.1 Add auth"
    );

    const { json, exitCode } = await run(
      "instructions.mjs",
      ["add-auth", "--apply", "--artifact", "tasks", "--group", "1"],
      { esddPath }
    );

    expect(exitCode).toBe(0);
    expect(json.instruction).toContain("1. Setup");
    expect(json.instruction).not.toContain("{{TASK_GROUP}}");
    expect(json.outputPath).toContain("tasks.md");
    expect(json.dependencies).toBeArray();
  });

  test("apply returns error for out-of-range group", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/tasks.md", "## 1. Setup\n- [ ] 1.1 Create project");

    const { json } = await run(
      "instructions.mjs",
      ["add-auth", "--apply", "--artifact", "tasks", "--group", "5"],
      { esddPath }
    );

    expect(json.error).toContain("out of range");
  });

  test("apply returns error when tasks.md does not exist", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/.keep", "");

    const { json } = await run(
      "instructions.mjs",
      ["add-auth", "--apply", "--artifact", "tasks", "--group", "1"],
      { esddPath }
    );

    expect(json.error).toContain("not found");
  });

  test("--archive requires --artifact", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("instructions.mjs", ["add-auth", "--archive"], {
      esddPath
    });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("--archive requires --artifact");
  });

  test("archive returns null instruction when no delta spec files", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/.keep", "");

    const { json, exitCode } = await run(
      "instructions.mjs",
      ["add-auth", "--archive", "--artifact", "specs"],
      { esddPath }
    );

    expect(exitCode).toBe(0);
    expect(json.instruction).toBeNull();
  });

  test("archive returns instruction with delta spec domains", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath, { domains: [{ name: "auth", description: "Authentication" }] });
    writeFixture(esddPath, "changes/add-auth/specs/auth.md", "# Delta spec");

    const { json, exitCode } = await run(
      "instructions.mjs",
      ["add-auth", "--archive", "--artifact", "specs"],
      { esddPath }
    );

    expect(exitCode).toBe(0);
    expect(json.instruction).toContain("[auth]");
    expect(json.instruction).toContain(": Authentication");
    expect(json.instruction).not.toContain("{{DELTAS}}");
    expect(json.instruction).not.toContain("{{DOMAINS}}");
    expect(json.instruction).toContain("specs/auth.md");
    expect(json.instruction).toContain("domains/auth.md");
  });

  test("archive includes known and unknown domains from delta files", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath, { domains: [{ name: "auth", description: "Authentication" }] });
    writeFixture(esddPath, "changes/add-auth/specs/auth.md", "# Auth delta");
    writeFixture(esddPath, "changes/add-auth/specs/billing.md", "# Billing delta");

    const { json, exitCode } = await run(
      "instructions.mjs",
      ["add-auth", "--archive", "--artifact", "specs"],
      { esddPath }
    );

    expect(exitCode).toBe(0);
    expect(json.instruction).toContain("[auth]");
    expect(json.instruction).toContain(": Authentication");
    expect(json.instruction).toContain("[billing]");
    expect(json.instruction).not.toContain("billing:");
    expect(json.instruction).not.toContain("{{DELTA}}");
    expect(json.instruction).not.toContain("{{DOMAINS}}");
  });

  test("archive returns error for non-archive artifact", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json } = await run(
      "instructions.mjs",
      ["add-auth", "--archive", "--artifact", "proposal"],
      { esddPath }
    );

    expect(json.error).toContain("not in the archive phase");
  });

  test("uses per-change workflow for plan instructions", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/quick-fix/.keep", "");
    writeYamlFixture(esddPath, "changes/quick-fix/change.yaml", { workflow: "spec-first-quick" });

    const { json, exitCode } = await run(
      "instructions.mjs",
      ["quick-fix", "--plan", "--artifact", "brief"],
      { esddPath }
    );

    expect(exitCode).toBe(0);
    expect(json.instruction).toContain("brief document");
    expect(json.outputPath).toContain("brief.md");
    expect(json.templatePath).toBeDefined();
  });

  test("per-change workflow correctly resolves dependencies", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/quick-fix/brief.md", "# Brief");
    writeYamlFixture(esddPath, "changes/quick-fix/change.yaml", { workflow: "spec-first-quick" });

    const { json } = await run("instructions.mjs", ["quick-fix", "--plan", "--artifact", "tasks"], {
      esddPath
    });

    expect(json.dependencies).toHaveLength(1);
    expect(json.dependencies[0]).toContain("brief.md");
  });

  test("spec-anchored-quick uses brief as dependency for specs", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/med-change/brief.md", "# Brief");
    writeYamlFixture(esddPath, "changes/med-change/change.yaml", {
      workflow: "spec-anchored-quick"
    });

    const { json } = await run(
      "instructions.mjs",
      ["med-change", "--plan", "--artifact", "specs"],
      { esddPath }
    );

    expect(json.dependencies).toHaveLength(1);
    expect(json.dependencies[0]).toContain("brief.md");
  });
});
