# Changelog

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
