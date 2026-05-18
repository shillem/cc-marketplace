# Document

## Arguments

- `$REST` may contain: `--domain <name>[:<description>] [--domain <name>[:<description>]] [--scan <glob>]`

## Flow

1. **Parse arguments:**
   - Collect all `--domain` entries as `{ name, description? }`
   - If none provided, stop and show usage: `/esdd document --domain <name>[:<description>] [--domain ...] [--scan <glob>]`

2. **Resolve descriptions:**
   - If a domain has a description, use it
   - If a domain is missing a description and `--scan` is provided, scan that scope and infer a short description
   - If a domain is missing a description and `--scan` is not provided, stop and inform the user: pass `--domain <name>:<description>` or add `--scan <glob>` so ESDD can infer one

3. **Determine scan scope:**
   - If `--scan` was provided, use it
   - Otherwise, suggest a scope derived from the domain name and project map if declared. Then use the ask tool to confirm or let the user override with a glob pattern

4. **Get instructions:**
   Run the CLI script: `node <skill-dir>/scripts/cli.mjs document --instruction`.

   The JSON output includes:
   - `instruction`: Specific guidance for the artifact
   - `templatePath`: Where to source the template for the artifact
   - `domainsPath`: Directory where domain spec files are stored

   If an `error` field is present, report it and stop.

5. **Per-domain loop:**
   Loop through each domain, using the task tool to track progress. For each domain, do the following:

   a. **Produce the domain spec:**
   - Read the template at `templatePath` for shape reference
   - Derive the output path as `<domainsPath>/<name>.md`
   - Read the existing file at the output path if it exists
   - If needed to resolve the description, scan the code within the `--scan` scope first
   - Scan the code within the scope determined in step 3
   - Follow the `instruction` — write the result to the output path

   b. **Register the domain:**
   Run the CLI script: `node <skill-dir>/scripts/cli.mjs document --register "<name>:<resolved-description>"`.

   The JSON output includes `{ name, description, outputPath, status }` where `status` is `"added"` (new domain) or `"updated"` (existing domain).

6. **Show summary:**
   - List domains documented with their `status`
