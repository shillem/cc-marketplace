# View

## Flow

1. **Get project info and active changes:**

   Run the CLI script: `node <skill-dir>/scripts/cli.mjs view`.

2. **Display setup:**

   ```
   **Setup**

   **Path**: <path>
   **Existing Domains**: <domains>
   **Available Workflows**: <workflows>

   **Default Workflow**
   <defaultWorkflow>

   **Constitution**

   Project Map: <yes/no>
   Tech Stack: <yes/no>
   ```

   If any `constitution` properties are `false`, note that adding the missing section to `CLAUDE.md` improves agent context during apply.

3. **Display active changes:**

   ```
   **Active Changes**
   ```

   - **If none exist:** Report that there are no active changes.

   - **Otherwise, display as a table.** Example:

     ```
     | Change | Workflow | Plan | Last Modified | Apply | Last Modified |
     |--------|----------|------|---------------|-------|----------------|
     | add-oauth | spec-anchored | 2/4 | 2h ago | 0/3 | — |
     | fix-billing | spec-first-quick | 4/4 | 1d ago | 2/2 | 3h ago |
     ```

     - **Workflow** = `activeChanges.workflow`
     - **Plan** = count of `activeChanges.plan.artifacts` with status `ready` / count of `activeChanges.plan.artifacts`
     - **Apply** = count of `activeChanges.apply.artifacts` with status `done` / count of `activeChanges.apply.artifacts`
     - **Plan Modified** / **Apply Modified** = `lastModified` value; show `—` if `null`

4. **Display number of archived changes:**

   ```
   **Number of archived changes**: <archivedChangesCount>
   ```

That's it — no suggestions, no next steps. Just the facts.
