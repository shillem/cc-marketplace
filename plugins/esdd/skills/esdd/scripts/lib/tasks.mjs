export function parseTasks(content) {
  const groups = [];
  let currentGroup = null;
  let total = 0;
  let complete = 0;

  for (const line of content.split("\n")) {
    const groupMatch = line.match(/^##\s+(.+)$/);

    if (groupMatch) {
      currentGroup = { group: groupMatch[1].trim(), items: [] };
      groups.push(currentGroup);
      continue;
    }

    if (/^\s*- \[[ x]\]/.test(line)) {
      total++;
      const isComplete = /^\s*- \[x\]/i.test(line);
      if (isComplete) complete++;

      const taskMatch = line.match(/^\s*- \[([ x])\]\s+(\S+)\s+(.+)$/i);
      if (taskMatch && currentGroup) {
        currentGroup.items.push({
          id: taskMatch[2],
          description: taskMatch[3].trim(),
          status: isComplete ? "complete" : "pending"
        });
      }
    }
  }

  return {
    groups,
    progress: { total, complete }
  };
}
