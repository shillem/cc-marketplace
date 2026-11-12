## Verification

Use an isolated subagent or fresh agent context if available. Send it the prompt below, substituting the skill directory for `<skill-dir>` and the change's `name` and `path` from status for `<name>` and `<change-path>`. Do not summarize, change, or drop prompt lines. If isolation is unavailable, perform the same review inline:

```text
- Run `node <skill-dir>/scripts/cli.mjs status "<name>" --plan` to get `plan.workflow`.
- For each artifact ID, run `node <skill-dir>/scripts/cli.mjs instructions "<name>" --plan --artifact <artifact>`.
- Read the artifacts in `<change-path>`, the returned instructions, templates if any, and dependencies. If instructions cannot be loaded, report failure rather than guessing.
- Review only. Use the instructions as review criteria, not to author or edit artifacts.
- Verify **Coherence** of the artifacts:
  - Flag contradictions and superseded statements between artifacts, judged by their configured responsibilities. Do not flag legitimate compatibility or deployed-data migration steps. MAJOR.
  - Flag artifact content that its instructions exclude. Recommend removing it, or moving it where the instructions place it, rather than aligning code to it. MINOR.
- Verify **Coherence** of the implementation:
  - Flag code or tests in the change's scope that the current target no longer calls for. MAJOR.
  - Flag new code that deviates from project patterns (file naming, directory structure, coding style). MINOR.
- Verify **Correctness:**
  - For each required outcome in the artifacts, search the codebase for implementation evidence.
    - Unimplemented: CRITICAL
    - Divergent from intent: MAJOR
  - For each stated acceptance case, check coverage in code or tests.
    - Uncovered: MAJOR
- End each issue with a `- Recommendation:` entry that states whether to update artifacts, implementation or both and gives the specific change with file/line references. When another fix is plausible, explain why the recommended one is preferable; when the evidence favors neither, say so and name the decision the user must make. Recommend revisions to the owning artifacts; code does not automatically establish intended behavior.
- Output the report listing issues by priority (CRITICAL / MAJOR / MINOR), or state that no issues were found.
```
