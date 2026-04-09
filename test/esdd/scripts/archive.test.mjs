import { describe, test, expect } from "bun:test";
import { existsSync, readFileSync, readdirSync } from "fs";
import { resolve } from "path";
import yaml from "../../../plugins/esdd/skills/esdd/scripts/vendor/js-yaml.mjs";
import { createTmpDir, initFixture, run, writeFixture, writeYamlFixture } from "./helpers.mjs";

describe("archive", () => {
  test("fails without a change name", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("archive", [], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("Usage");
  });

  test("rejects invalid change name", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("archive", ["bad name!"], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("Invalid change name");
  });

  test("fails if change does not exist", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("archive", ["nonexistent"], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("not found");
  });

  test("moves change to archive directory", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/proposal.md", "# Proposal");

    const { json, exitCode } = await run("archive", ["add-auth"], { esddPath });

    expect(exitCode).toBe(0);
    expect(json.archived).toBeDefined();
    expect(json.archived.from).toContain("add-auth");
    expect(existsSync(resolve(esddPath, "changes/add-auth"))).toBe(false);

    const archiveDirs = readdirSync(resolve(esddPath, "archive"));
    expect(archiveDirs).toHaveLength(1);
    expect(archiveDirs[0]).toMatch(/^\d{4}-\d{2}-\d{2}-add-auth$/);
  });

  test("detects new domains with descriptions from frontmatter", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(
      esddPath,
      "changes/add-auth/specs/auth.md",
      "---\ndescription: Authentication and authorization\n---\n# Auth spec"
    );
    writeFixture(
      esddPath,
      "changes/add-auth/specs/billing.md",
      "---\ndescription: Billing and payments\n---\n# Billing spec"
    );

    const { json } = await run("archive", ["add-auth"], { esddPath });

    expect(json.domains).toContain("auth");
    expect(json.domains).toContain("billing");

    const config = yaml.load(readFileSync(resolve(esddPath, "config.yaml"), "utf8"));
    const auth = config.domains.find(d => d.name === "auth");
    const billing = config.domains.find(d => d.name === "billing");
    expect(auth.description).toBe("Authentication and authorization");
    expect(billing.description).toBe("Billing and payments");
  });

  test("no domains without frontmatter", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/add-auth/specs/auth.md", "# Auth spec");

    const { json } = await run("archive", ["add-auth"], { esddPath });

    expect(json.domains).toBeUndefined();
  });

  test("updates description for existing domain from frontmatter", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath, { domains: [{ name: "auth", description: "Authentication" }] });
    writeFixture(
      esddPath,
      "changes/add-auth/specs/auth.md",
      "---\ndescription: Authentication and authorization\n---\n# Auth spec"
    );

    const { json } = await run("archive", ["add-auth"], { esddPath });

    expect(json.domains).toContain("auth");

    const config = yaml.load(readFileSync(resolve(esddPath, "config.yaml"), "utf8"));
    const auth = config.domains.find(d => d.name === "auth");
    expect(auth.description).toBe("Authentication and authorization");
  });

  test("archives change with per-change workflow", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(esddPath, "changes/quick-fix/brief.md", "# Brief");
    writeYamlFixture(esddPath, "changes/quick-fix/change.yaml", { workflow: "spec-first-quick" });

    const { json, exitCode } = await run("archive", ["quick-fix"], { esddPath });

    expect(exitCode).toBe(0);
    expect(json.archived).toBeDefined();
    expect(json.domains).toBeUndefined();
  });

  test("archives spec-anchored-quick change with domain extraction", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);
    writeFixture(
      esddPath,
      "changes/med-change/specs/auth.md",
      "---\ndescription: Auth module\n---\n# Auth delta"
    );
    writeYamlFixture(esddPath, "changes/med-change/change.yaml", {
      workflow: "spec-anchored-quick"
    });

    const { json, exitCode } = await run("archive", ["med-change"], { esddPath });

    expect(exitCode).toBe(0);
    expect(json.domains).toContain("auth");
  });

  test("fails if not initialized", async () => {
    const esddPath = createTmpDir();
    writeFixture(esddPath, "changes/add-auth/.keep", "");

    const { json, exitCode } = await run("archive", ["add-auth"], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toBeDefined();
  });
});
