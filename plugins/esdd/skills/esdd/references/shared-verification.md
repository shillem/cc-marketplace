## Verification

Use an isolated subagent or fresh agent context if available. Send it the prompt below, substituting the skill directory for `<skill-dir>` and the change's `name` and `path` from status for `<name>` and `<change-path>`. Do not summarize, change, or drop prompt lines. If isolation is unavailable, perform the same review inline:

```text
- Run `node <skill-dir>/scripts/cli.mjs status "<name>" --plan` to get `plan.workflow`.
- For each artifact ID, run `node <skill-dir>/scripts/cli.mjs instructions "<name>" --plan --artifact <artifact>`.
- Read the artifacts in `<change-path>`, the returned instructions, templates if any, and dependencies. If instructions cannot be loaded, report failure rather than guessing.
- Review only; do not edit files or execute the artifact authoring instructions.
- Verify **Coherence:**
  - Check that artifacts agree within their configured responsibilities. Flag contradictions and superseded instructions, not legitimate compatibility or deployed-data migration steps.
  - Flag abandoned mechanisms or tests in the change's scope that the current target no longer calls for.
  - Assess whether the implementation is consistent with the intent expressed across all the artifact files
  - Review new code for consistency with project patterns (file naming, directory structure, coding style)
  - Issues: MAJOR for target mismatches, MINOR for pattern deviations
- Verify **Correctness:**
  - For each required outcome in the artifacts, search the codebase for implementation evidence
    - Unimplemented: CRITICAL
    - Divergent from intent: MAJOR
  - For each stated acceptance case, check coverage in code/tests
    - Uncovered: MAJOR
- Each issue must have a specific, actionable recommendation with file/line references. State whether to update artifacts, implementation or both. Recommend revisions to the owning artifacts; code does not automatically establish intended behavior.
- Output report listing issues by priority (CRITICAL / MAJOR / MINOR)
```
