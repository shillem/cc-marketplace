import { resolve } from "path";
import {
  artifactPath,
  changePath,
  exists,
  isMultiFileOutput,
  listOutputFiles,
  mtime,
  mtimeOrNull,
  multiFileOutputPrefix,
  multiFileOutputSuffix,
  readText
} from "./fs-utils.mjs";
import { parseTasks } from "./tasks.mjs";

export function computeChange(changeName, schema, phases, options) {
  const entry = { name: changeName };

  if (phases.length === 0 || phases.includes("plan")) {
    entry.plan = computePlanStatus(changeName, schema, options);
  }

  if (phases.length === 0 || phases.includes("apply")) {
    entry.apply = computeApplyStatus(changeName, schema, options);
  }

  return entry;
}

function computeApplyStatus(changeName, schema, { trackLastModified = false } = {}) {
  const { phases, artifacts } = schema;
  const apply = phases.apply;

  if (!apply || apply.length === 0) {
    return null;
  }

  const applyArtifacts = {};
  let lastModified = new Date(0);

  for (const id of apply) {
    const art = artifacts[id];
    const artPath = artifactPath(changeName, art.output);

    if (!exists(artPath)) {
      applyArtifacts[id] = { status: "pending", groups: [] };
      continue;
    }

    if (trackLastModified) {
      const mt = mtime(artPath);
      if (mt > lastModified) lastModified = mt;
    }

    const { groups } = parseTasks(readText(artPath));

    const groupSummaries = groups.map((g, i) => ({
      id: i + 1,
      name: g.group,
      status: g.items.every(item => item.status === "complete") ? "done" : "pending"
    }));

    const allDone = groupSummaries.length > 0 && groupSummaries.every(g => g.status === "done");

    applyArtifacts[id] = {
      status: allDone ? "done" : "pending",
      groups: groupSummaries
    };
  }

  const result = {
    workflow: apply,
    artifacts: applyArtifacts
  };

  if (trackLastModified) result.lastModified = lastModified.toISOString();

  return result;
}

function computePlanStatus(changeName, schema, { trackLastModified = false } = {}) {
  const { phases } = schema;
  const plan = phases.plan;
  const applySet = new Set(phases.apply || []);
  const artifacts = {};
  const existsCache = {};
  const outputFilesCache = {};
  let lastModified = new Date(0);

  for (let i = 0; i < plan.length; i++) {
    const id = plan[i];
    const output = schema.artifacts[id].output;
    const isMulti = isMultiFileOutput(output);
    const isApplyArt = applySet.has(id);

    let hasArtifact;

    if (isMulti) {
      const artDir = artifactPath(changeName, output);
      const files = (outputFilesCache[id] ??= listOutputFiles(
        artDir,
        multiFileOutputSuffix(output)
      ));
      hasArtifact = existsCache[id] = files.length > 0;
      if (trackLastModified && hasArtifact) {
        for (const f of files) {
          const mt = mtime(f.path);
          if (mt > lastModified) lastModified = mt;
        }
      }
    } else {
      const artPath = resolve(changePath(changeName), output);
      if (trackLastModified && existsCache[id] == null) {
        const mt = mtimeOrNull(artPath);
        hasArtifact = existsCache[id] = mt !== null;
        if (mt && mt > lastModified) lastModified = mt;
      } else {
        hasArtifact = existsCache[id] ??= exists(artPath);
      }
    }

    let taskProgress = { total: 0, complete: 0 };

    if (isApplyArt && hasArtifact && !isMulti) {
      taskProgress = parseTasks(readText(resolve(changePath(changeName), output))).progress;
    }

    let status;
    let details;

    if (hasArtifact) {
      details = validateArtifact({
        output,
        outputFiles: isMulti ? outputFilesCache[id] : null,
        isApplyArtifact: isApplyArt,
        taskProgress
      });

      status = details.some(d => d.errors.length > 0) ? "invalid" : "ready";
    } else {
      const depsComplete = plan.slice(0, i).every(depId => {
        if (existsCache[depId] != null) return existsCache[depId];
        const depOutput = schema.artifacts[depId].output;
        const depExists = isMultiFileOutput(depOutput)
          ? (outputFilesCache[depId] ??= listOutputFiles(
              artifactPath(changeName, depOutput),
              multiFileOutputSuffix(depOutput)
            )).length > 0
          : exists(resolve(changePath(changeName), depOutput));
        existsCache[depId] = depExists;
        return depExists;
      });

      status = depsComplete ? "pending" : "blocked";
    }

    const entry = { status };

    if (details) entry.details = details;

    artifacts[id] = entry;
  }

  const result = { workflow: plan, artifacts };
  if (trackLastModified) result.lastModified = lastModified.toISOString();
  return result;
}

function validateArtifact({ output, outputFiles, isApplyArtifact, taskProgress }) {
  if (isMultiFileOutput(output)) {
    const prefix = multiFileOutputPrefix(output);
    if (outputFiles.length === 0) {
      return [{ path: prefix, errors: ["No files found"] }];
    }
    const suffix = multiFileOutputSuffix(output);
    return outputFiles.map(f => {
      const relPath = `${prefix}${f.name}${suffix}`;
      return { path: relPath, errors: [] };
    });
  }

  const errors = [];

  if (isApplyArtifact) {
    if (taskProgress.total === 0) {
      errors.push("No checkbox tasks found (expected `- [ ]` format)");
    }
  }

  return [{ path: output, errors }];
}
