export function parseArg(args, flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] || null : null;
}

export function parseDomain(value) {
  const colonIndex = value.indexOf(":");

  if (colonIndex === -1) {
    return { name: value.trim(), description: "" };
  }

  return {
    name: value.slice(0, colonIndex).trim(),
    description: value.slice(colonIndex + 1).trim()
  };
}

export function parsePhases(args) {
  const phases = [];

  if (args.includes("--plan")) phases.push("plan");
  if (args.includes("--apply")) phases.push("apply");
  if (args.includes("--archive")) phases.push("archive");

  return phases;
}
