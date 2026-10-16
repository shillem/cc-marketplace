## Artifact Revision

**Inputs:** `<change-name>` and the requested revision.  
Edit artifacts only; do not implement code.

1. **Inspect affected work:**
   - For each affected artifact, run `node <skill-dir>/scripts/cli.mjs instructions "<change-name>" --plan --artifact <artifact>` and read its instructions, template and dependencies.
   - Read artifacts and implementation, including partial work. Preserve unrelated or unexplained edits.
   - Code is evidence of implementation, not approval of intent. Do not retain a decision merely because an earlier attempt implemented it.

2. **Resolve the decision:**
   - Use the configured instructions to identify where the changed decision belongs. Do not infer authority from artifact names or order.
   - Resolve contradictions in the owning artifact. Apply choices already settled by the user; obtain a decision before changing agreed scope, behavior or architecture. Wording repairs need no new approval. Stop affected work if a necessary choice is unresolved.

3. **Rewrite the target:**
   - Update the owning artifact and affected dependents as instructions for a first implementation. Replace superseded content; retain applicable constraints, requirements, rationale and unrelated content, not implementation history or repair instructions.
   - Keep alternatives only when they explain a current trade-off or unresolved choice. Follow the configured instructions when adding or removing artifact files.

4. **Derive tasks:**
   - Preserve valid outcomes and wording, not obsolete groups or IDs. Replacement, removal or migration tasks describe intended changes to pre-existing code, contracts or data, not cleanup of earlier attempts. Follow the task format and update numbering and references after structural edits.

5. **Check and report:**
   - Check agreement, coverage and completion against the implementation. Run `node <skill-dir>/scripts/cli.mjs status "<change-name>" --apply` and fix structural errors.
   - Report whether revision completed or is blocked, changed decisions and files, and remaining work.
