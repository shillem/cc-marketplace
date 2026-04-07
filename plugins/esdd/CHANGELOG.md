# Changelog

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
