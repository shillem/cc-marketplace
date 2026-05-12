# Changelog

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
