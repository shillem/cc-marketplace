import { relative, resolve } from "path";
import {
  artifactPath,
  domainsPath,
  exists,
  isMultiFileOutput,
  listOutputFiles,
  multiFileOutputFilename,
  readText
} from "./fs-utils.mjs";
import { parseTasks } from "./tasks.mjs";

export function buildArchiveInstructions(config, changeName, artifactId) {
  const {
    artifacts,
    phases: { archive }
  } = config.schema;

  if (!archive || !archive.includes(artifactId)) {
    return { error: `Artifact '${artifactId}' is not in the archive phase` };
  }

  const art = artifacts[artifactId];
  const cwd = process.cwd();
  const multiFile = isMultiFileOutput(art.output);

  if (!multiFile) {
    return {
      instruction: art.archiveInstruction
        .replace("{{DELTAS}}", `- ${relative(cwd, artifactPath(changeName, art.output))}`)
        .replace("{{DOMAINS}}", `- ${relative(cwd, domainsPath())}`)
    };
  }

  const filename = multiFileOutputFilename(art.output);
  const deltaFiles = listOutputFiles(artifactPath(changeName, art.output), filename);

  if (deltaFiles.length === 0) {
    return { instruction: null };
  }

  let instruction = art.archiveInstruction;

  if (instruction.includes("{{DELTAS}}")) {
    const lines = deltaFiles.map(df => `- [${df.name}](${relative(cwd, df.path)})`);

    instruction = instruction.replace("{{DELTAS}}", lines.join("\n"));
  }

  instruction = replaceDomains(
    instruction,
    deltaFiles.map(df => {
      const domain = config.domains.find(dd => df.name === dd.name);
      return {
        name: df.name,
        description: domain ? domain.description : "",
        path: resolve(domainsPath(), df.name, "spec.md")
      };
    }),
    cwd
  );

  return { instruction };
}

export function buildApplyInstructions(config, changeName, artifactId, groupId) {
  const { phases, artifacts } = config.schema;

  if (!phases.apply || !phases.apply.includes(artifactId)) {
    return { error: `Artifact '${artifactId}' is not in the apply phase` };
  }

  const art = artifacts[artifactId];
  const artPath = artifactPath(changeName, art.output);

  if (!exists(artPath)) {
    return { error: `${art.output} not found` };
  }

  const applySet = new Set(phases.apply);
  const depIds = phases.plan.filter(id => !applySet.has(id));
  const dependencies = collectDependencyFiles(changeName, artifacts, depIds);

  const { groups } = parseTasks(readText(artPath));
  const groupIndex = groupId - 1;
  if (groupIndex < 0 || groupIndex >= groups.length) {
    return { error: `Group id ${groupId} out of range (1-${groups.length})` };
  }

  let instruction = art.applyInstruction;

  if (instruction.includes("{{TASK_GROUP}}")) {
    instruction = instruction.replace("{{TASK_GROUP}}", groups[groupIndex].group);
  }

  return {
    instruction,
    outputPath: relative(process.cwd(), artPath),
    dependencies
  };
}

export function buildPlanInstructions(config, changeName, artifactId) {
  const { phases, artifacts } = config.schema;
  const plan = phases.plan;
  const artifactIndex = plan.indexOf(artifactId);

  if (artifactIndex === -1) {
    return { error: `Artifact '${artifactId}' not found in plan phase` };
  }

  const art = artifacts[artifactId];

  return {
    templatePath: art.templatePath,
    instruction: replaceDomains(
      art.instruction,
      config.domains.map(d => ({
        name: d.name,
        description: d.description,
        path: resolve(domainsPath(), d.name, "spec.md")
      })),
      process.cwd()
    ),
    outputPath: relative(process.cwd(), artifactPath(changeName, art.output)),
    dependencies: collectDependencyFiles(changeName, artifacts, plan.slice(0, artifactIndex))
  };
}

function collectDependencyFiles(changeName, artifacts, artifactIds) {
  const files = [];

  for (const id of artifactIds) {
    const output = artifacts[id].output;
    if (isMultiFileOutput(output)) {
      const outputFiles = listOutputFiles(
        artifactPath(changeName, output),
        multiFileOutputFilename(output)
      );
      for (const file of outputFiles) {
        files.push(relative(process.cwd(), file.path));
      }
    } else {
      const path = artifactPath(changeName, output);
      if (exists(path)) {
        files.push(relative(process.cwd(), path));
      }
    }
  }

  return files;
}

function replaceDomains(instruction, domains, cwd) {
  if (!instruction.includes("{{DOMAINS}}")) return instruction;

  if (domains.length === 0) {
    return instruction.replace("{{DOMAINS}}", "No domains defined yet.");
  }

  const lines = domains.map(d => {
    const name = d.path ? `[${d.name}](${relative(cwd, d.path)})` : d.name;
    let desc = d.description ? `: ${d.description}` : "";
    desc += d.path ? "" : " (no spec file yet)";

    return `- ${name + desc}`;
  });

  return instruction.replace("{{DOMAINS}}", lines.join("\n"));
}
