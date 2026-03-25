## Flow

1. **Get available workflows:**

   ```bash
   node "${CLAUDE_SKILL_DIR}/scripts/init.mjs" --list-workflows
   ```

   Present the workflow choices to the user using their names and descriptions from the output. If only one workflow exists, use it as the default and confirm with the user.

2. **Ask user to define domains.** Explain that domains organize the project's spec areas (e.g., `auth`, `billing`, `data-export`). Each domain accumulates requirements over time as changes are archived.

   Ask the user:
   - What are the main domains, areas, or modules you want to keep track of in your project?
   - For each, provide a short name (kebab-case) and description

   The user may provide none — that's fine. Domains can be added later during archive.

3. **Run init script:**

   ```bash
   node "${CLAUDE_SKILL_DIR}/scripts/init.mjs" --create --workflow "<chosen-workflow>" [--domain "name:description"]...
   ```

   Include each domain the user defined as a `--domain` flag. If no domains, just run with `--create --workflow "<name>"` alone.

4. **Check for errors** in script output. If `error` field exists, report the error and stop.

5. **Show summary:**

   ```
   **Path**: <path>
   **Domains**: <domains>
   **Workflow**: <workflow>
   ```

6. **Suggest next steps:** `/esdd new <feature>` to plan a change, or `/esdd explore` to think about something first
