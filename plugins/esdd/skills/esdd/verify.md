## Arguments

- `$REST` may contain: `[<change-name>]`

## Flow

1. **Select the change:**
   - If a change name was provided, use it directly
   - Otherwise, run: `node "${CLAUDE_SKILL_DIR}/scripts/list.mjs"`
   - Show changes that have tasks. If ambiguous, ask the user to select.

2. **Get change context:**
   - Run `node "${CLAUDE_SKILL_DIR}/scripts/status.mjs" "<name>"` to get plan/apply statuses and change path
   - Read all artifact files from the change path for full context.

3. **Run verification across three dimensions.** Use the Explore agent to run these in parallel:

### Dimension 1: Completeness

**Task Completion:**

- Parse checkboxes in apply artifacts (from the instructions output): `- [ ]` (incomplete) vs `- [x]` (complete)
- If incomplete tasks exist: CRITICAL issue for each

**Spec Coverage:**

- Read delta specs from domain-organized artifacts under the change directory
- Extract all requirements (marked with `### Requirement:`)
- For each requirement, search the codebase for implementation evidence
- If a requirement appears unimplemented: CRITICAL issue

### Dimension 2: Correctness

**Requirement Implementation Mapping:**

- For each requirement from delta specs, search codebase for implementation
- Assess if implementation matches requirement intent
- If divergence detected: WARNING issue

**Scenario Coverage:**

- For each scenario in delta specs (marked with `#### Scenario:`), check if conditions are handled in code
- Check if tests exist covering the scenario
- If scenario appears uncovered: WARNING issue

### Dimension 3: Coherence

**Design Adherence:**

- If design.md exists, extract key decisions
- Verify implementation follows those decisions
- If contradiction detected: WARNING issue

**Domain Fitness:**

- Are the chosen domains appropriate for this change?
- Are any domains missing that should have been touched?
- Are any over-broad?
- If issues: WARNING issue

**Proposal-to-Specs Consistency:**

- Every domain listed in proposal's Domains section must have a corresponding folder under the change's domain-organized artifacts
- Every domain folder in domain-organized artifacts must correspond to a domain listed in the proposal
- If mismatches: WARNING issue

**Code Pattern Consistency:**

- Review new code for consistency with project patterns
- If significant deviations: SUGGESTION issue

4. **Generate verification report:**

   ```
   ## Verification Report: <change-name>

   ### Summary
   | Dimension    | Status              |
   |--------------|---------------------|
   | Completeness | X/Y tasks, N reqs   |
   | Correctness  | M/N reqs covered    |
   | Coherence    | Followed / Issues   |
   ```

   **Issues by Priority:**
   1. **CRITICAL** (Must fix before archive): Incomplete tasks, missing requirements
   2. **WARNING** (Should fix): Spec/design divergences, missing scenarios, domain issues
   3. **SUGGESTION** (Nice to fix): Pattern inconsistencies, minor improvements

   Each issue must have a specific, actionable recommendation with file/line references.

   **Final Assessment:**
   - If CRITICAL issues: "X critical issue(s) found. Fix before archiving."
   - If only warnings: "No critical issues. Y warning(s) to consider. Ready for archive."
   - If all clear: "All checks passed. Ready for archive with `/esdd archive`."

## Verification Heuristics

- **Completeness**: Focus on objective checklist items
- **Correctness**: Use keyword search and reasonable inference — don't require perfect certainty
- **Coherence**: Look for glaring inconsistencies, don't nitpick style
- **False Positives**: When uncertain, prefer SUGGESTION over WARNING, WARNING over CRITICAL
- **Actionability**: Every issue must have a specific recommendation

## Graceful Degradation

- If only apply artifacts exist: verify task completion only, skip spec/design checks
- If apply + domain artifacts exist: verify completeness and correctness, skip design
- If full artifacts: verify all three dimensions
- Always note which checks were skipped and why
