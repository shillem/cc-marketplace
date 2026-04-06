# ESDD Document

## Arguments

- `$REST` may contain: `--domain <name>:<description> [--domain <name>:<description>] [--scan <glob>]`

## Flow

1. **Parse arguments:**
   - Collect all `--domain name:description` entries
   - If none provided, stop and show usage: `/esdd document --domain <name>:<description> [--domain ...] [--scan <glob>]`

2. **Determine scan scopes:**
   - If `--scan` was provided, use it
   - Otherwise, suggest a scope derived from the domain name, and project map if declared. Then use the **AskUserQuestion** tool to confirm or let the user override with a glob pattern.

3. **Get instructions:**
   Run `node "${CLAUDE_SKILL_DIR}/scripts/document.mjs" --instruction`.

   The JSON output includes:
   - `instruction`: Specific guidance for the artifact
   - `templatePath`: Where to source the template for the artifact
   - `domainsPath`: Directory where domain spec files are stored

   If an `error` field is present, report it and stop.

4. **Per-domain loop:**
   Use the **TodoWrite** tool to track progress through domains.

   For each domain collected in step 1:

   a. **Produce the domain spec:**
   - Read the template at `templatePath` for shape reference
   - Derive the output path as `<domainsPath>/<name>.md`
   - Read the existing file at the output path if it exists
   - Scan the code within the scope determined in step 2
   - Follow `instruction` — write the result to the output path

   b. **Register the domain:**
   Run `node "${CLAUDE_SKILL_DIR}/scripts/document.mjs" --register "<name>:<description>"`.

   The JSON output includes `{ name, description, outputPath, status }` where `status` is `"added"` (new domain) or `"updated"` (existing domain).

5. **Show summary:**
   - List domains documented with their `status`
