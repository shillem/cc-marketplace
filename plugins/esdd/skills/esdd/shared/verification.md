## Verification

**Expects from calling action:** change's `path` from status output.

Use the subagent tool with this prompt (replace `<change-path>` with the change's `path`):

> - Read all artifact files from `<change-path>` for full context
> - Verify **Coherence:**
>   - Assess whether the implementation is consistent with the intent expressed across all the artifact files
>   - Review new code for consistency with project patterns (file naming, directory structure, coding style)
>   - Issues: WARNING for intent/spec mismatches, SUGGESTION for pattern deviations
> - Verify **Correctness:**
>   - For each requirement (`### Requirement:`), search codebase for implementation evidence
>     - Unimplemented: CRITICAL
>     - Divergent from intent: WARNING
>   - For each scenario (`#### Scenario:`), check if covered in code/tests
>     - Uncovered: WARNING
> - Each issue must have a specific, actionable recommendation with file/line references. Never recommend creating new artifact files.
> - Output report listing issues by priority (CRITICAL / WARNING / SUGGESTION)
