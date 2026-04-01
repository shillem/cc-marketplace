import { resolve } from "path";
import {
  changePath,
  exists,
  esddPath,
  multiFileOutputFilename,
  readText,
  readYaml,
  schemasDir,
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
      this.error = "ESDD not initialized. Run /esdd init first.";
    }

    this.#baseSchema = readYaml(resolve(schemasDir(), "schema.yaml"));
  }

  get domains() {
    return this.#userConfig?.domains || [];
  }

  get workflows() {
    return mergeWorkflows(this.#baseSchema.workflows, this.#userConfig?.workflows || {});
  }

  schema({ changeName, workflowName } = {}) {
    if (!this.#userConfig) return undefined;

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

function mergeConfigs(schema, config, workflowOverride) {
  const wn = workflowOverride || config?.workflow || Object.keys(schema.workflows || {})[0];

  if (!wn) {
    return { errors: ["No workflow defined"] };
  }

  const workflow = config?.workflows?.[wn] || schema.workflows?.[wn] || null;

  if (!workflow) {
    return { errors: [`Workflow '${wn}' not found`] };
  }

  const plan = workflow.plan || [];
  const apply = workflow.apply || [];
  const archive = workflow.archive || [];

  if (plan.length === 0) {
    return { errors: ["Plan phase is empty"] };
  }

  if (apply.length === 0) {
    return { errors: ["Apply phase is empty"] };
  }

  const allArtifacts = resolveArtifacts(schema, config);
  const errors = [];
  const seen = new Set();
  const artifacts = {};

  for (const id of plan) {
    if (seen.has(id)) {
      errors.push(`Duplicate artifact ID in plan phase: ${id}`);
    }
    seen.add(id);

    const art = allArtifacts[id];
    if (!art) {
      errors.push(`Artifact '${id}' not found in artifacts`);
      continue;
    }

    const description = art.description || null;
    const output = art.output || null;
    if (!output) {
      errors.push(`Artifact '${id}' has no output`);
    }

    const instruction = resolvePhaseInstruction("plan", id, allArtifacts, config);
    if (!instruction) {
      errors.push(`Artifact '${id}' has no plan.instruction`);
    }

    const discussion = allArtifacts[id]?.plan?.discussion === true;
    const applyInstruction = resolvePhaseInstruction("apply", id, allArtifacts, config);
    const archiveInstruction = resolvePhaseInstruction("archive", id, allArtifacts, config);

    const templatePath = resolveTemplatePath(id, allArtifacts, config);
    if (!templatePath) {
      errors.push(`Artifact '${id}' has no template`);
    }

    artifacts[id] = {
      description,
      discussion,
      output,
      instruction,
      applyInstruction,
      archiveInstruction,
      templatePath
    };
  }

  function validatePhaseArtifacts(phase, ids) {
    for (const id of ids) {
      if (!seen.has(id)) {
        errors.push(`${phase} phase artifact '${id}' not found in plan phase`);
      } else if (!artifacts[id]?.[`${phase}Instruction`]) {
        errors.push(`${phase} phase artifact '${id}' has no ${phase}.instruction`);
      }
    }
  }

  validatePhaseArtifacts("apply", apply);
  validatePhaseArtifacts("archive", archive);

  if (errors.length > 0) {
    return { errors };
  }

  return {
    workflow: wn,
    phases: { plan, apply, archive },
    artifacts
  };
}

function mergeInstruction(base, override, addendum) {
  if (override) return override;
  if (addendum && base) return base + "\n" + addendum;
  return base;
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
    if (merged[id]) {
      merged[id] = { ...merged[id], ...configArtifacts[id] };
    } else {
      merged[id] = configArtifacts[id];
    }
  }

  return merged;
}

function resolvePhaseInstruction(phase, artifactId, allArtifacts, config) {
  const base = allArtifacts[artifactId]?.[phase]?.instruction || null;
  const cfg = config?.artifacts?.[artifactId];

  return mergeInstruction(base, cfg?.[phase]?.instruction, cfg?.[phase]?.instruction_addendum);
}

function resolveTemplatePath(artifactId, allArtifacts, config) {
  const configTemplate = config?.artifacts?.[artifactId]?.template;

  if (configTemplate) {
    const overridePath = resolve(esddPath(), "templates", configTemplate);
    if (exists(overridePath)) {
      return overridePath;
    }
  }

  const art = allArtifacts[artifactId];
  const output = art?.output;
  const templateName = output ? multiFileOutputFilename(output) : `${artifactId}.md`;
  const defaultPath = resolve(schemasDir(), "templates", templateName);

  if (exists(defaultPath)) {
    return defaultPath;
  }

  return null;
}
