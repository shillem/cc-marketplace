import { describe, test, expect } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";
import yaml from "../../../plugins/esdd/skills/esdd/scripts/vendor/js-yaml.mjs";
import { createTmpDir, initFixture, run } from "./helpers.mjs";

describe("document.mjs", () => {
  test("fails without flags", async () => {
    const esddPath = createTmpDir();
    initFixture(esddPath);

    const { json, exitCode } = await run("document.mjs", [], { esddPath });

    expect(exitCode).toBe(1);
    expect(json.error).toContain("Usage");
  });

  describe("--instruction", () => {
    test("returns instruction, templatePath, and domainsPath", async () => {
      const esddPath = createTmpDir();
      initFixture(esddPath);

      const { json, exitCode } = await run("document.mjs", ["--instruction"], { esddPath });

      expect(exitCode).toBe(0);
      expect(json.instruction).toContain("accumulated domain spec");
      expect(json.templatePath).toContain("domain.md");
      expect(json.domainsPath).toContain("domains");
    });

    test("fails when ESDD is not initialized", async () => {
      const esddPath = createTmpDir();

      const { json, exitCode } = await run("document.mjs", ["--instruction"], { esddPath });

      expect(exitCode).toBe(1);
      expect(json.error).toContain("not initialized");
    });

    test("fails when workflow does not support document", async () => {
      const esddPath = createTmpDir();
      initFixture(esddPath, { workflow: "spec-first" });

      const { json, exitCode } = await run("document.mjs", ["--instruction"], { esddPath });

      expect(exitCode).toBe(1);
      expect(json.error).toContain("does not support document");
    });
  });

  describe("--register", () => {
    test("registers a new domain in config.yaml", async () => {
      const esddPath = createTmpDir();
      initFixture(esddPath);

      const { json, exitCode } = await run(
        "document.mjs",
        ["--register", "billing:Payments and invoices"],
        { esddPath }
      );

      expect(exitCode).toBe(0);
      expect(json.name).toBe("billing");
      expect(json.description).toBe("Payments and invoices");
      expect(json.outputPath).toContain("domains");
      expect(json.outputPath).toContain("billing.md");
      expect(json.status).toBe("added");

      const configPath = resolve(esddPath, "config.yaml");
      const config = yaml.load(readFileSync(configPath, "utf8"));

      expect(config.domains).toHaveLength(1);
      expect(config.domains[0].name).toBe("billing");
      expect(config.domains[0].description).toBe("Payments and invoices");
    });

    test("returns updated status for existing domain", async () => {
      const esddPath = createTmpDir();
      initFixture(esddPath, {
        domains: [{ name: "auth", description: "Authentication" }]
      });

      const { json, exitCode } = await run("document.mjs", ["--register", "auth:Authentication"], {
        esddPath
      });

      expect(exitCode).toBe(0);
      expect(json.status).toBe("updated");
    });

    test("preserves existing description when no new description provided", async () => {
      const esddPath = createTmpDir();
      initFixture(esddPath, {
        domains: [{ name: "auth", description: "Original description" }]
      });

      await run("document.mjs", ["--register", "auth"], { esddPath });

      const configPath = resolve(esddPath, "config.yaml");
      const config = yaml.load(readFileSync(configPath, "utf8"));

      expect(config.domains[0].description).toBe("Original description");
    });

    test("fails without a domain name", async () => {
      const esddPath = createTmpDir();
      initFixture(esddPath);

      const { json, exitCode } = await run("document.mjs", ["--register"], { esddPath });

      expect(exitCode).toBe(1);
    });
  });
});
