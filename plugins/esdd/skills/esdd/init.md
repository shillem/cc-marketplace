# Init

## Flow

1. **Survey the project:**
   Run the CLI script: `node <skill-dir>/scripts/cli.mjs init --survey`.

   **Constitution check**: If `constitution.projectMap` or `constitution.techStack` is `false`, suggest the user add the missing sections to their `CLAUDE.md`. Also mention that project conventions can be wrapped in `<important if="condition">` blocks for better instruction adherence — they ensure agents only attend to rules relevant to the current task. Show this example:

   ```markdown
   ## Tech Stack

   TypeScript, React, Node.js, PostgreSQL.

   ## Project Map

   - `src/api/` — Express REST API
   - `src/web/` — React web application
   - `src/shared/` — shared utilities and types
   - `tests/` — test suites
   ```

2. **Present workflows:**
   Present the workflow choices to the user using their names and descriptions from the output. If only one workflow exists, use it as the default and confirm with the user.

3. **Ask user to define domains:**
   Explain that domains organize the project's spec areas (e.g., `auth`, `billing`, `data-export`). Each domain accumulates requirements over time as changes are archived.

   Ask the user:
   - What are the main domains, areas, or modules you want to keep track of in your project?
   - For each, provide a short name (kebab-case) and description

   The user may provide none — that's fine. Domains can be added later during archive.

4. **Run init script:**
   Run the CLI script: `node <skill-dir>/scripts/cli.mjs init --create --workflow "<chosen-workflow>" [--domain "name:description"]...`.

   Include each domain the user defined as a `--domain` flag. If no domains, just run with `--create --workflow "<name>"` alone.

5. **Check for errors** in script output. If `error` field exists, report the error and stop.

6. **Show summary:**

   ```
   **Path**: <path>
   **Domains**: <domains>
   **Workflow**: <workflow>
   ```

7. **Suggest next steps:** `/esdd new <feature>` to plan a change, or `/esdd explore` to think about something first. If the workflow supports it and the project has existing code, `/esdd document --domain <name>:<description>` can bootstrap accumulated domain specs from that code.
