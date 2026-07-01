# Changelog

## 1.1.7 (2026-07-01)

### Changed

- Moved ESDD action and documentation references into the skill-local `references` directory
- Updated skill entrypoint and nested reference links to resolve the relocated files

## 1.1.6 (2026-06-03)

### Changed

- Clarified verification discrepancy follow-up so reports name whether to update artifacts or implementation before asking the user how to proceed

## 1.1.5 (2026-05-28)

### Changed

- Tightened task artifact guidance so task groups use concise deliverable titles, avoid generic suffixes like “Slice”, and keep testing or regression work inside the relevant implementation slice

## 1.1.4 (2026-05-28)

### Changed

- Made `/esdd document --scan <glob>` required and shared across all requested domains
- Clarified that `/esdd document` explores the shared scan scope per domain using the domain name and resolved description
- Removed project map fallback guidance from document bootstrap instructions

## 1.1.3 (2026-05-27)

### Changed

- Simplified `/esdd verify` and `/esdd archive` discrepancy handling so commands always output the verification report, then ask how to proceed without prescriptive reconciliation choices
- Tightened task artifact guidance so tasks stay focused on implementation slices and avoid standalone verification, readiness review, archiving, or summary checklist items
- Clarified verification recommendations must reference existing files and must not suggest creating new artifact files

## 1.1.2 (2026-05-27)

### Changed

- Added explicit “Show verification report” choices to `/esdd verify` and `/esdd archive` discrepancy handling
- Kept shared verification instructions focused on producing priority-grouped issue reports while command flows decide when to display them

## 1.1.1 (2026-05-27)

### Changed

- Clarified verification reports so discrepancies must identify relevant artifact/code paths, line references when available, the mismatch, and an actionable recommendation
- Moved discrepancy reconciliation choices into `/esdd verify` and `/esdd archive`, including explicit options to reconcile artifacts, reconcile code, continue archiving, or stop as appropriate

## 1.1.0 (2026-05-25)

### Changed

- Removed the `CLAUDE.md` constitution check from `/esdd init --status`, `/esdd init --survey`, `/esdd view`, and related skill guidance
- Updated ESDD documentation to describe project context as existing project instructions plus accumulated domain specs instead of required `Project Map` and `Tech Stack` sections

## 1.0.9 (2026-05-18)

### Changed

- Added a compact `/esdd` help summary for empty or unknown actions, with inline usage and key flags across the README and commands reference
- Clarified `/esdd document` so domain descriptions can be omitted when `--scan` is provided, and updated the document/init guidance to explain how descriptions are resolved
- Tightened verification follow-up guidance when reconciling change artifacts after review

### Fixed

- Corrected `/esdd verify` to request archive-level status data before verification
- Corrected `/esdd view` phase rendering so multi-step workflows display as a readable comma-separated list

## 1.0.8 (2026-05-12)

### Changed

- Normalized wording and sentence punctuation across the README, skill docs, and schema guidance for cleaner, more consistent instructions

## 1.0.7 (2026-04-28)

### Changed

- Replaced relative `node scripts/cli.mjs ...` examples with `node <skill-dir>/scripts/cli.mjs ...` across the ESDD skill docs so commands resolve correctly from any working directory
- Simplified skill markdown headings by removing redundant `ESDD` prefixes and standardizing section titles

## 1.0.6 (2026-04-24)

### Changed

- Tightened the skill description so ESDD only triggers on explicit requests, ESDD-specific references, or existing ESDD changes
- Added explicit exclusions for ordinary coding, debugging, refactoring, and small code changes

## 1.0.5 (2026-04-23)

### Changed

- Clarified skill instructions to use generic ask, task, and subagent tool names instead of harness-specific labels
- Simplified `SKILL.md` action dispatch guidance and removed the outdated `allowed-tools` frontmatter entry

## 1.0.4 (2026-04-17)

### Changed

- Renamed `.docs/` to `docs/` so the plugin documentation directory is visible; README links updated accordingly
- Tightened skill step formatting: inlined Task-tool progress tracking into surrounding loop steps and removed redundant blank lines between step headings and bodies

## 1.0.3 (2026-04-09)

### Changed

- Consolidated standalone scripts into a single CLI entrypoint (`cli.mjs`) with action-based routing
- Replaced `CLAUDE_SKILL_DIR` with relative paths in all skill files
- Renamed `discussion` flag to `review` across schema, scripts, and plan-loop
- Adopted GIVEN/WHEN/THEN format (with AND chaining) for spec scenarios, replacing WHEN/THEN
- Streamlined design artifact by removing Open Questions and Migration Plan sections
- Clarified argument hints in SKILL.md and standardized command suggestion wording

## 1.0.2 (2026-04-08)

### Fixed

- Status script loop variable bug in plan status computation
- Archive phase missing from status output — `archive.workflow` was never produced

### Improved

- Status phases now cascade: `--archive` implies apply and plan, `--apply` implies plan
- Skill actions (`apply`, `verify`, `archive`) now request only the phases they need
- Minor wording fixes in document and verification instructions

## 1.0.1 (2026-04-07)

### Improved

- Replaced `TodoWrite` with Task tools (`TaskCreate`, `TaskGet`, `TaskList`, `TaskUpdate`) for progress tracking across apply, archive, document, and plan-loop actions
- Prefixed "Plan Loop" shared heading with "ESDD" for clarity

## 1.0.0

- Initial release
- Single `/esdd` skill with action dispatch (init, explore, new, continue, apply, verify, archive, view)
- Node.js scripts with vendored js-yaml for YAML processing
- Domain-based spec organization
- Customizable workflow via config.yaml
