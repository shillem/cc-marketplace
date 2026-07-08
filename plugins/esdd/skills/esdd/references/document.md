# Document

## Arguments

- `$REST` must contain: `--domain <name>[:<description>] [--domain <name>[:<description>]] --scan <glob>`

## Flow

1. **Parse arguments:**
   - Collect all `--domain` entries as `{ name, description? }`
   - Collect `--scan` as the shared scan scope for all domains
   - If no domains or no scan scope were provided, stop and show usage: `/esdd document --domain <name>[:<description>] [--domain ...] --scan <glob>`

2. **Get instructions:**
   Run the CLI script: `node <skill-dir>/scripts/cli.mjs document --instruction`.

   The JSON output includes:
   - `instruction`: Specific guidance for the artifact
   - `templatePath`: Where to source the template for the artifact
   - `domainsPath`: Directory where domain spec files are stored

   If an `error` field is present, report it and stop.

3. **Per-domain loop:**
   Loop through each domain, tracking progress clearly as you go. For each domain, do the following:

   a. **Produce the domain spec:**
   - Read the template at `templatePath` for shape reference
   - Derive the output path as `<domainsPath>/<name>.md`
   - Read the existing file at the output path if it exists
   - Explore files within the shared `--scan` scope, guided by the domain name and description when provided
   - If the domain is missing a description, infer a short description from the relevant code found in that scope
   - Follow the `instruction` — write the result to the output path

   b. **Register the domain:**
   Use the provided description, or the inferred description if none was provided, as `<resolved-description>`.

   Run the CLI script: `node <skill-dir>/scripts/cli.mjs document --register "<name>:<resolved-description>"`.

   The JSON output includes `{ name, description, outputPath, status }` where `status` is `"added"` (new domain) or `"updated"` (existing domain).

4. **Show summary:**
   - List domains documented with their `status`
