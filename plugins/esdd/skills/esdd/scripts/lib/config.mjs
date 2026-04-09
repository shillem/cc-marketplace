import { resolve } from "path";
import {
  changePath,
  exists,
  esddPath,
  readText,
  readYaml,
  assetsPath,
  writeYaml
} from "./fs-utils.mjs";

const CONSTITUTION_FILES = ["CLAUDE.md", "CLAUDE.local.md"];
const PROJECT_MAP_RE = /^##\s+project\s+map/im;
const TECH_STACK_RE = /^##\s+tech\s+stack/im;

export class Config {
  #baseSchema;
  #userConfig;
  #changeCache = {};
  #workflowCache = {};

  constructor() {
    try {
      this.#userConfig = readYaml(getConfigPath());
    } catch {
      // uninitialized; #userConfig stays undefined
    }

    this.#baseSchema = readYaml(resolve(assetsPath(), "schema.yaml"));
  }

  get initialized() {
    return this.#userConfig != null;
  }

  get domains() {
    return this.#userConfig?.domains || [];
  }

  get workflows() {
    return mergeWorkflows(this.#baseSchema.workflows, this.#userConfig?.workflows || {});
  }

  schema({ changeName, workflowName } = {}) {
    if (!this.initialized) {
      throw new ConfigError("ESDD not initialized. Run /esdd init first.");
    }

    const resolved = this.#resolveAny({ changeName, workflowName });

    if (resolved.errors) {
      throw new ConfigError(resolved.errors);
    }

    return resolved;
  }

  updateConfig(properties) {
    const configPath = getConfigPath();
    const config = readYaml(configPath);

    if (properties.domains) {
      const existing = config.domains || [];
      const byName = new Map(existing.map(d => [d.name, d]));

      for (const d of properties.domains) {
        if (byName.has(d.name)) {
          byName.get(d.name).description = d.description;
        } else {
          existing.push(d);
        }
      }

      config.domains = existing;
    }

    if (properties.workflow) {
      config.workflow = properties.workflow;
    }

    writeYaml(configPath, config);
  }

  writeChangeConfig(changeName, data) {
    writeYaml(resolve(changePath(changeName), "change.yaml"), data);
  }

  #resolveAny({ changeName, workflowName }) {
    if (workflowName) {
      return this.#resolveWorkflow(workflowName);
    }

    if (!changeName) {
      return this.#resolveWorkflow();
    }

    if (this.#changeCache[changeName]) {
      return this.#changeCache[changeName];
    }

    let workflow;

    try {
      workflow = readYaml(resolve(changePath(changeName), "change.yaml"))?.workflow;
    } catch {
      // no per-change config
    }

    return (this.#changeCache[changeName] = this.#resolveWorkflow(workflow));
  }

  #resolveWorkflow(workflowName) {
    const defaultSchema = (this.#workflowCache[""] ??= mergeConfigs(
      this.#baseSchema,
      this.#userConfig
    ));

    if (!workflowName || workflowName === defaultSchema?.workflow) {
      return defaultSchema;
    }

    return (this.#workflowCache[workflowName] ??= mergeConfigs(
      this.#baseSchema,
      this.#userConfig,
      workflowName
    ));
  }
}

export class ConfigError extends Error {
  constructor(messages) {
    super(Array.isArray(messages) ? messages.join("; ") : messages);
    this.name = "ConfigError";
  }
}

export function checkConstitution() {
  const cwd = process.cwd();

  const checks = {
    projectMap: false,
    techStack: false
  };

  for (const file of CONSTITUTION_FILES) {
    const filePath = resolve(cwd, file);

    if (!exists(filePath)) continue;

    const content = readText(filePath);

    if (PROJECT_MAP_RE.test(content)) checks.projectMap = true;
    if (TECH_STACK_RE.test(content)) checks.techStack = true;
  }

  return checks;
}

export function getConfigPath() {
  return resolve(esddPath(), "config.yaml");
}

function isPlainObject(val) {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

function mergeConfigs(schema, config, workflowOverride) {
  const result = {
    workflow: workflowOverride || config?.workflow || Object.keys(schema.workflows || {})[0],
    phases: {},
    artifacts: {}
  };

  if (!result.workflow) {
    return { errors: ["No workflow defined"] };
  }

  const workflow =
    config?.workflows?.[result.workflow] || schema.workflows?.[result.workflow] || null;

  if (!workflow) {
    return { errors: [`Workflow '${result.workflow}' not found`] };
  }

  const allArtifacts = resolveArtifacts(schema, config);
  const errors = [];

  for (const phase of ["plan", "apply", "archive"]) {
    result.phases[phase] = workflow[phase] || [];

    if (phase === "plan" && result.phases[phase].length === 0) {
      return { errors: ["Plan phase is empty"] };
    }

    if (phase === "apply" && result.phases[phase].length === 0) {
      return { errors: ["Apply phase is empty"] };
    }

    const seen = new Set();

    for (const id of result.phases[phase]) {
      if (seen.has(id)) {
        errors.push(`Duplicate artifact ID in ${phase} phase: ${id}`);
      }
      seen.add(id);

      const art = allArtifacts[id];
      if (!art) {
        errors.push(`Artifact '${id}' not found in artifacts`);
        continue;
      }

      const entry =
        result.artifacts[id] ||
        (result.artifacts[id] = {
          description: art.description,
          output: art.output
        });

      if (!entry.output) {
        errors.push(`Artifact '${id}' has no output`);
      }

      entry[phase] = {
        instruction: mergeInstruction(art[phase]?.instruction, art[phase]?.instruction_addendum),
        template: resolveTemplatePath(art[phase]?.template)
      };

      if (phase === "plan") {
        entry[phase].review = art[phase]?.review === true;
      }

      if (!entry[phase].instruction) {
        errors.push(`Artifact '${id}' has no ${phase}.instruction`);
      }
    }
  }

  if (workflow.document) {
    const id = workflow.document;
    const art = allArtifacts[id];

    if (!art) {
      errors.push(`Artifact '${id}' not found in artifacts`);
    } else {
      result.document = {
        id,
        instruction: mergeInstruction(
          art.document?.instruction,
          art.document?.instruction_addendum
        ),
        template: resolveTemplatePath(art.document?.template)
      };

      if (!result.document.instruction) {
        errors.push(`Artifact '${id}' has no document.instruction`);
      }
    }
  }

  return errors.length > 0 ? { errors } : result;
}

function mergeInstruction(base, addendum) {
  return addendum ? base + "\n" + addendum : base;
}

function mergeWorkflows(sw, cw) {
  const names = [...new Set([...Object.keys(sw), ...Object.keys(cw)])];

  return names.map(name => {
    const wf = cw[name] || sw[name] || {};
    return { name, description: wf.description };
  });
}

function resolveArtifacts(schema, config) {
  const merged = {};
  const schemaArtifacts = schema.artifacts || {};
  const configArtifacts = config?.artifacts || {};

  for (const id of Object.keys(schemaArtifacts)) {
    merged[id] = schemaArtifacts[id];
  }

  for (const id of Object.keys(configArtifacts)) {
    if (!merged[id]) {
      merged[id] = configArtifacts[id];
      continue;
    }

    const base = merged[id];
    const override = configArtifacts[id];
    const result = { ...base };

    for (const key of Object.keys(override)) {
      const baseVal = base[key];
      const overVal = override[key];

      if (isPlainObject(baseVal) && isPlainObject(overVal)) {
        result[key] = { ...baseVal, ...overVal };
      } else {
        result[key] = overVal;
      }
    }

    merged[id] = result;
  }

  return merged;
}

function resolveTemplatePath(template) {
  if (template) {
    const userPhasePath = resolve(esddPath(), "templates", template);
    if (exists(userPhasePath)) return userPhasePath;

    const defaultPhasePath = resolve(assetsPath(), "templates", template);
    if (exists(defaultPhasePath)) return defaultPhasePath;
  }

  return null;
}
