## Verification

**Expects from calling action:** change's `path` from status output.

Use the Explore **Agent** tool with this prompt (replace `<change-path>` with the change's `path`):

> - Read all artifact files from `<change-path>` for full context
> - Verify **Coherence:**
>   - Assess whether the implementation is consistent with the intent expressed across the change artifacts
>   - Check that domains listed in artifacts match domain folders and vice versa
>   - Review new code for consistency with project patterns (file naming, directory structure, coding style)
>   - Issues: WARNING for intent/spec mismatches, SUGGESTION for pattern deviations
> - Verify **Correctness:**
>   - For each requirement (`### Requirement:`), search codebase for implementation evidence
>     - Unimplemented: CRITICAL
>     - Divergent from intent: WARNING
>   - For each scenario (`#### Scenario:`), check if covered in code/tests
>     - Uncovered: WARNING
> - Each issue must have a specific, actionable recommendation with file/line references

**Handle result:**

- Show the verification report with issues grouped by priority (CRITICAL / WARNING / SUGGESTION)
- Use **AskUserQuestion** tool to let the user choose:
  - Update change specs to match code changes
  - Continue without changes
  - Stop
