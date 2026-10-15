## Verification

**Expects from calling action:** change's `path` from status output.

Use an isolated subagent or fresh agent context if available. Send it the prompt below, replacing only `<change-path>` with the change's `path`; do not summarize, change, or drop prompt lines. If isolation is unavailable, perform the same review inline after rereading the change artifacts:

```text
- Read all artifact files from `<change-path>` for full context
- Verify **Coherence:**
  - Assess whether the implementation is consistent with the intent expressed across all the artifact files
  - Review new code for consistency with project patterns (file naming, directory structure, coding style)
  - Issues: WARNING for intent/spec mismatches, SUGGESTION for pattern deviations
- Verify **Correctness:**
  - For each requirement (`### Requirement:`), search codebase for implementation evidence
    - Unimplemented: CRITICAL
    - Divergent from intent: WARNING
  - For each scenario (`#### Scenario:`), check if covered in code/tests
    - Uncovered: WARNING
- Verify **Robustness:** For requirements involving shared state, batch processing, retries, external side effects, configuration consumed by versioned tooling, or time-based behavior, check the implementation against applicable failure scenarios in the specs, such as repeated execution, partial failure, concurrent modification, stale state, boundary times, and unsupported configuration. A material failure mode with neither specified behavior nor implementation handling is a WARNING.
- Each issue must have a specific, actionable recommendation with file/line references. The recommendation must state whether to update artifacts or update implementation. Never recommend creating new artifact files.
- Output report listing issues by priority (CRITICAL / WARNING / SUGGESTION)
```
