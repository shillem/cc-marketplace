## Verification

Use an isolated subagent or fresh agent context if available. Send it the prompt below, substituting the skill directory for `<skill-dir>` and the change's `name` and `path` from status for `<name>` and `<change-path>`. Do not summarize, change, or drop prompt lines. If isolation is unavailable, perform the same review inline:

```text
- Run `node <skill-dir>/scripts/cli.mjs status "<name>" --plan` to get `plan.workflow`.
- For each artifact ID, run `node <skill-dir>/scripts/cli.mjs instructions "<name>" --plan --artifact <artifact>`.
- Read the artifacts in `<change-path>`, the returned instructions, templates if any, and dependencies. Use the configured roles and formats, not assumed artifact names or headings. If instructions cannot be loaded, report failure rather than guessing.
- Review only; do not edit files or execute the artifact authoring instructions.
- Verify **Coherence:**
  - Check that artifacts agree within their configured responsibilities. Flag contradictions and superseded instructions, not legitimate compatibility or deployed-data migration steps.
  - Flag abandoned mechanisms in the change's scope that the current target no longer calls for; do not treat existing code as justification for changing intent.
  - Assess whether the implementation is consistent with the intent expressed across all the artifact files
  - Review new code for consistency with project patterns (file naming, directory structure, coding style)
  - Issues: WARNING for target mismatches, SUGGESTION for pattern deviations
- Verify **Correctness:**
  - For each required outcome in the artifacts, search the codebase for implementation evidence
    - Unimplemented: CRITICAL
    - Divergent from intent: WARNING
  - For each stated acceptance case, check coverage in code/tests
    - Uncovered: WARNING
- Verify **Robustness:** For behavior involving shared state, batch processing, retries, external side effects, configuration consumed by versioned tooling, or time-based behavior, check the implementation against applicable failure cases described in the artifacts, such as repeated execution, partial failure, concurrent modification, stale state, boundary times, and unsupported configuration. A material failure mode with neither specified behavior nor implementation handling is a WARNING.
- Each issue must have a specific, actionable recommendation with file/line references. State whether to update artifacts, implementation or both. Recommend revisions to the owning artifacts, not separate repair documents or checklists; code does not automatically establish intended behavior.
- Output report listing issues by priority (CRITICAL / WARNING / SUGGESTION)
```
