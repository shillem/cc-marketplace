## Artifact Revision

**Inputs:** `<change-name>` and the requested revision.  
Edit artifacts only; do not implement code.

1. **Inspect affected work:**
   - For each affected artifact, run `node <skill-dir>/scripts/cli.mjs instructions "<change-name>" --plan --artifact <artifact>` and read its instructions, template and dependencies.
   - Read artifacts and implementation, including partial work. Preserve unrelated or unexplained edits.
   - Code is evidence of implementation, not approval of intent.

2. **Resolve the decision:**
   - Use the configured instructions to identify where the changed decision belongs.
   - Resolve contradictions in the owning artifact. Apply choices already settled by the user; obtain a decision before changing agreed scope, behavior or architecture. Wording repairs need no new approval. Stop affected work if a necessary choice is unresolved.

3. **Rewrite the target:**
   - Update the owning artifact and affected dependents as first drafts, following the working rules. Replace superseded content; retain applicable constraints, requirements, rationale and unrelated content.

4. **Derive tasks:**
   - Preserve valid outcomes and wording, not obsolete groups or IDs.

5. **Check and report:**
   - Check agreement, coverage and completion against the implementation. Run `node <skill-dir>/scripts/cli.mjs status "<change-name>" --apply` and fix structural errors.
   - Report whether revision completed or is blocked, changed decisions and files, and remaining work.
